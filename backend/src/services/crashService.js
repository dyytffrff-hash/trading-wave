const CrashGame = require("../models/CrashGame");

const {
  placeBet,
  addWinnings
} = require("./betService");

const MIN_BET = 50;
const MIN_CRASH = 1.01;
const MAX_CRASH = 300.00;

function generateCrashPoint() {
  const random = Math.random();

  const crashPoint =
    1 + (-Math.log(1 - random) * 4);

  return Number(
    Math.min(
      MAX_CRASH,
      Math.max(
        MIN_CRASH,
        crashPoint
      )
    ).toFixed(2)
  );
}

async function startCrash(
  entryId,
  betAmount
) {
  if (
    typeof betAmount !== "number" ||
    !Number.isFinite(betAmount)
  ) {
    throw new Error("Invalid bet amount");
  }

  if (betAmount < MIN_BET) {
    throw new Error(
      `Minimum bet is $${MIN_BET} DEMO`
    );
  }

  await placeBet(
    entryId,
    betAmount
  );

  const crashPoint =
    generateCrashPoint();

  const game = await CrashGame.create({
    entry: entryId,
    betAmount,
    crashPoint,
    currentMultiplier: 1.00,
    status: "running"
  });

  return {
    success: true,
    game: "crash",
    gameId: game._id,
    entryId,
    betAmount,
    currentMultiplier: 1.00,
    status: "running"
  };
}

async function updateMultiplier(
  gameId,
  multiplier
) {
  const game =
    await CrashGame.findById(gameId);

  if (!game) {
    throw new Error(
      "Crash game not found"
    );
  }

  if (game.status !== "running") {
    return {
      status: game.status,
      multiplier:
        game.currentMultiplier
    };
  }

  if (
    typeof multiplier !== "number" ||
    !Number.isFinite(multiplier)
  ) {
    throw new Error(
      "Invalid multiplier"
    );
  }

  if (multiplier < 1.00) {
    throw new Error(
      "Invalid multiplier"
    );
  }

  /*
   * Never allow the client to move the
   * multiplier backwards.
   */
  if (
    multiplier <
    game.currentMultiplier
  ) {
    throw new Error(
      "Multiplier cannot move backwards"
    );
  }

  /*
   * The server checks the hidden crash point.
   */
  if (
    multiplier >=
    game.crashPoint
  ) {
    game.currentMultiplier =
      game.crashPoint;

    game.status = "crashed";
    game.winnings = 0;
    game.finishedAt = new Date();

    await game.save();

    return {
      status: "crashed",
      multiplier:
        game.crashPoint
    };
  }

  game.currentMultiplier =
    Number(multiplier.toFixed(2));

  await game.save();

  return {
    status: "running",
    multiplier:
      game.currentMultiplier
  };
}

async function cashOut(
  gameId
) {
  const game =
    await CrashGame.findById(gameId);

  if (!game) {
    throw new Error(
      "Crash game not found"
    );
  }

  if (game.status !== "running") {
    throw new Error(
      "Crash game is not active"
    );
  }

  /*
   * The server uses its own stored
   * multiplier, not a multiplier supplied
   * by the player.
   */
  const currentMultiplier =
    game.currentMultiplier;

  if (
    currentMultiplier >=
    game.crashPoint
  ) {
    game.status = "crashed";
    game.winnings = 0;
    game.finishedAt = new Date();

    await game.save();

    return {
      success: true,
      game: "crash",
      status: "crashed",
      crashPoint:
        game.crashPoint,
      winnings: 0
    };
  }

  const winnings = Number(
    (
      game.betAmount *
      currentMultiplier
    ).toFixed(2)
  );

  const result =
    await addWinnings(
      game.entry,
      winnings
    );

  game.status = "cashed_out";
  game.cashOutMultiplier =
    currentMultiplier;
  game.winnings =
    winnings;
  game.finishedAt =
    new Date();

  await game.save();

  return {
    success: true,
    game: "crash",
    status: "cashed_out",
    cashOutMultiplier:
      currentMultiplier,
    winnings,
    demoBalance:
      result.demoBalance,
    targetResult:
      result.targetResult
  };
}

module.exports = {
  startCrash,
  updateMultiplier,
  cashOut,
  generateCrashPoint
};
