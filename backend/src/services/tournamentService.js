const Tournament = require("../models/Tournament");


// ==========================================
// AI TARGET GENERATOR
// ==========================================

function generateAITarget() {
  const MIN_TARGET = 2500;
  const MAX_TARGET = 6000;

  return Math.floor(
    Math.random() *
      (MAX_TARGET - MIN_TARGET + 1)
  ) + MIN_TARGET;
}


// ==========================================
// CREATE $2 STARTER TOURNAMENT
// ==========================================

async function createStarterTournament() {
  const tournament =
    await Tournament.create({
      name: "Trading Wave $2 Starter",

      entryFee: 2,

      durationHours: 72,

      winCondition:
        "highest_balance",

      targetAmount: null,

      targetSetByAI: false,

      startingDemoBalance: 500,

      games: [
        "crash",
        "coin_flip",
        "dice_cup",
        "dragon_net"
      ],

      winnerCount: 1,

      status: "waiting"
    });

  return tournament;
}


// ==========================================
// CREATE $10 TARGET TOURNAMENT
// ==========================================

async function createTenDollarTournament() {
  const tournament =
    await Tournament.create({
      name: "Trading Wave $10 Target",

      entryFee: 10,

      durationHours: 24,

      winCondition:
        "target_race",

      /*
       * Target stays hidden until the
       * tournament starts.
       */
      targetAmount: null,

      targetSetByAI: false,

      /*
       * $10 tournament starts with
       * $1,000 DEMO.
       */
      startingDemoBalance: 1000,

      games: [
        "crash",
        "coin_flip",
        "dice_cup",
        "dragon_net"
      ],

      winnerCount: 1,

      status: "waiting"
    });

  return tournament;
}


// ==========================================
// START TOURNAMENT
// ==========================================

async function startTournament(
  tournamentId
) {
  const tournament =
    await Tournament.findById(
      tournamentId
    );

  if (!tournament) {
    throw new Error(
      "Tournament not found"
    );
  }

  if (tournament.status !== "waiting") {
    throw new Error(
      "Tournament is not waiting to start"
    );
  }

  const now = new Date();

  tournament.status = "active";

  tournament.startsAt = now;

  tournament.endsAt =
    new Date(
      now.getTime() +
        tournament.durationHours *
          60 *
          60 *
          1000
    );


  // ========================================
  // SET PRIVATE AI TARGET
  // ========================================

  if (
    tournament.entryFee === 10 &&
    tournament.winCondition ===
      "target_race"
  ) {
    const target =
      generateAITarget();

    tournament.targetAmount = target;

    tournament.targetSetByAI = true;

    console.log(
      `AI target selected privately: ${target}`
    );
  }


  await tournament.save();

  return tournament;
}


// ==========================================
// FINISH TOURNAMENT
// ==========================================

async function finishTournament(
  tournamentId,
  platformKeepsPool = false
) {
  const tournament =
    await Tournament.findById(
      tournamentId
    );

  if (!tournament) {
    throw new Error(
      "Tournament not found"
    );
  }

  if (
    tournament.status ===
    "finished"
  ) {
    return tournament;
  }

  tournament.status = "finished";

  tournament.platformKeepsPool =
    platformKeepsPool;

  if (!tournament.endsAt) {
    tournament.endsAt = new Date();
  }

  await tournament.save();

  return tournament;
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createStarterTournament,
  createTenDollarTournament,
  startTournament,
  finishTournament,
  generateAITarget
};
