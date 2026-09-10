const DragonNetGame = require("../models/DragonNetGame");
const {
  placeBet,
  addWinnings
} = require("./betService");

const TOTAL_HOLES = 20;
const DRAGON_COUNT = 6;

const STARTING_MULTIPLIER = 1.98;
const MULTIPLIER_STEP = 1.98;

function createDragonBoard() {
  const dragons = new Set();

  while (dragons.size < DRAGON_COUNT) {
    const hole =
      Math.floor(Math.random() * TOTAL_HOLES) + 1;

    dragons.add(hole);
  }

  return Array.from(dragons);
}

function getMultiplier(safeHoles) {
  if (safeHoles <= 0) {
    return 0;
  }

  return Number(
    (
      STARTING_MULTIPLIER +
      (safeHoles - 1) * MULTIPLIER_STEP
    ).toFixed(2)
  );
}

function getCashoutAmount(
  betAmount,
  safeHoles
) {
  const multiplier =
    getMultiplier(safeHoles);

  return Number(
    (betAmount * multiplier).toFixed(2)
  );
}

async function startDragonNet(
  entryId,
  betAmount
) {
  // Make sure the bet is valid and deduct it.
  await placeBet(
    entryId,
    betAmount
  );

  // Generate NEW dragon positions for this game.
  const dragonHoles =
    createDragonBoard();

  const game =
    await DragonNetGame.create({
      entry: entryId,
      betAmount,
      totalHoles: TOTAL_HOLES,
      dragonCount: DRAGON_COUNT,
      dragonHoles,
      selectedHoles: [],
      safeHoles: 0,
      currentMultiplier: 0,
      currentCashout: 0,
      status: "playing"
    });

  return {
    success: true,
    game: "dragon_net",
    gameId: game._id,
    totalHoles: TOTAL_HOLES,
    dragonCount: DRAGON_COUNT,
    safeHoles: 0,
    multiplier: 0,
    cashout: 0,
    status: "playing"
  };
}

async function chooseHole(
  gameId,
  hole
) {
  const game =
    await DragonNetGame.findById(
      gameId
    );

  if (!game) {
    throw new Error(
      "Dragon Net game not found"
    );
  }

  if (game.status !== "playing") {
    throw new Error(
      "Dragon Net game is not active"
    );
  }

  const selectedHole = Number(hole);

  if (
    !Number.isInteger(selectedHole) ||
    selectedHole < 1 ||
    selectedHole > TOTAL_HOLES
  ) {
    throw new Error(
      "Choose a hole from 1 to 20"
    );
  }

  if (
    game.selectedHoles.includes(
      selectedHole
    )
  ) {
    throw new Error(
      "You already selected this hole"
    );
  }

  game.selectedHoles.push(
    selectedHole
  );

  const hitDragon =
    game.dragonHoles.includes(
      selectedHole
    );

  if (hitDragon) {
    game.status = "lost";
    game.currentMultiplier = 0;
    game.currentCashout = 0;
    game.finishedAt = new Date();

    await game.save();

    return {
      success: true,
      game: "dragon_net",
      gameId: game._id,
      status: "lost",
      selectedHole,
      hitDragon: true,
      safeHoles: game.safeHoles,
      multiplier: 0,
      cashout: 0
    };
  }

  game.safeHoles += 1;

  game.currentMultiplier =
    getMultiplier(
      game.safeHoles
    );

  game.currentCashout =
    getCashoutAmount(
      game.betAmount,
      game.safeHoles
    );

  await game.save();

  return {
    success: true,
    game: "dragon_net",
    gameId: game._id,
    status: "playing",
    selectedHole,
    hitDragon: false,
    safeHoles: game.safeHoles,
    multiplier:
      game.currentMultiplier,
    cashout:
      game.currentCashout
  };
}

async function cashOut(gameId) {
  const game =
    await DragonNetGame.findById(
      gameId
    );

  if (!game) {
    throw new Error(
      "Dragon Net game not found"
    );
  }

  if (game.status !== "playing") {
    throw new Error(
      "Dragon Net game is not active"
    );
  }

  if (game.safeHoles < 1) {
    throw new Error(
      "Choose at least one safe hole before cashing out"
    );
  }

  const winnings =
    getCashoutAmount(
      game.betAmount,
      game.safeHoles
    );

  const result =
    await addWinnings(
      game.entry,
      winnings
    );

  game.status = "cashed_out";
  game.currentCashout = winnings;
  game.finishedAt = new Date();

  await game.save();

  return {
    success: true,
    game: "dragon_net",
    gameId: game._id,
    status: "cashed_out",
    safeHoles: game.safeHoles,
    multiplier:
      game.currentMultiplier,
    cashout: winnings,
    demoBalance:
      result.demoBalance,
    targetResult:
      result.targetResult
  };
}

module.exports = {
  startDragonNet,
  chooseHole,
  cashOut,
  getMultiplier,
  getCashoutAmount
};
