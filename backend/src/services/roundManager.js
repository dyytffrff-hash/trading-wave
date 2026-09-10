const Tournament = require("../models/Tournament");

const {
  createStarterTournament,
  createTenDollarTournament
} = require("./tournamentService");

const {
  setTargetForTournament
} = require("./targetService");

const {
  settleStarterTournament
} = require("./starterSettlementService");

const SETTLEMENT_DELAY_MS = 5 * 60 * 1000;


// ==========================================
// START TOURNAMENT
// ==========================================

async function startTournament(tournamentId) {
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
      "Tournament is not waiting"
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

  await tournament.save();

  // ========================================
  // SET PRIVATE AI TARGET FOR $10
  // ========================================

  if (
    tournament.entryFee === 10 &&
    tournament.winCondition ===
      "target_race"
  ) {
    await setTargetForTournament(
      tournament._id
    );
  }

  return tournament;
}


// ==========================================
// FINISH EXPIRED TOURNAMENT
// ==========================================

async function finishExpiredTournament(
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

  if (tournament.status !== "active") {
    return tournament;
  }

  if (
    tournament.endsAt &&
    new Date() >= tournament.endsAt
  ) {

    // ======================================
    // $2 STARTER SETTLEMENT
    // ======================================

    if (tournament.entryFee === 2) {

      const result =
        await settleStarterTournament(
          tournament._id
        );

      // If the $2 tournament was actually
      // finished, schedule the next round.
      if (
        result &&
        result.settled === true
      ) {

        const finishedTournament =
          await Tournament.findById(
            tournament._id
          );

        if (
          finishedTournament &&
          finishedTournament.status ===
            "finished"
        ) {
          return scheduleNextRound(
            finishedTournament
          );
        }
      }

      return result;
    }


    // ======================================
    // $10 TARGET SETTLEMENT
    // ======================================

    tournament.status = "finished";

    if (
      tournament.entryFee === 10 &&
      tournament.winCondition ===
        "target_race" &&
      !tournament.winner
    ) {
      tournament.platformKeepsPool = true;
    }

    await tournament.save();

    return scheduleNextRound(
      tournament
    );
  }

  return tournament;
}


// ==========================================
// CREATE NEXT ROUND
// ==========================================

async function createNextRound(
  entryFee
) {
  let tournament;

  if (entryFee === 2) {

    tournament =
      await createStarterTournament();

  } else if (entryFee === 10) {

    tournament =
      await createTenDollarTournament();

  } else {

    throw new Error(
      "Unsupported tournament entry fee"
    );
  }


  // ========================================
  // PERSIST NEXT START TIME
  // ========================================

  tournament.startsAt =
    new Date(
      Date.now() +
        SETTLEMENT_DELAY_MS
    );

  await tournament.save();

  console.log(
    `Next $${entryFee} tournament scheduled for ${tournament.startsAt.toISOString()}`
  );

  return tournament;
}


// ==========================================
// SCHEDULE NEXT ROUND
// ==========================================

async function scheduleNextRound(
  tournament
) {
  if (!tournament) {
    throw new Error(
      "Tournament is required"
    );
  }

  if (
    tournament.status !== "finished"
  ) {
    throw new Error(
      "Tournament must be finished first"
    );
  }

  return createNextRound(
    tournament.entryFee
  );
}


// ==========================================
// PROCESS SCHEDULED TOURNAMENTS
// ==========================================

async function processScheduledTournaments() {

  // MongoDB must be connected.
  if (
    Tournament.db.readyState !== 1
  ) {
    return;
  }

  const now = new Date();

  const tournaments =
    await Tournament.find({
      status: "waiting",
      startsAt: {
        $ne: null,
        $lte: now
      }
    });

  for (
    const tournament
    of tournaments
  ) {

    try {

      await startTournament(
        tournament._id
      );

      console.log(
        `Scheduled $${tournament.entryFee} tournament started:`,
        tournament._id.toString()
      );

    } catch (error) {

      console.error(
        `Could not start scheduled tournament ${tournament._id}:`,
        error.message
      );

    }
  }
}


// ==========================================
// TOURNAMENT SCHEDULER
// ==========================================

let schedulerRunning = false;

function startTournamentScheduler() {

  // Prevent duplicate schedulers.
  if (schedulerRunning) {
    return;
  }

  schedulerRunning = true;

  console.log(
    "Tournament scheduler started."
  );


  const runScheduler =
    async () => {

      try {

        await processScheduledTournaments();

      } catch (error) {

        console.error(
  "Tournament scheduler error:",
  error
);

      }
    };


  // Check immediately.
  runScheduler();


  // Check every 60 seconds.
  setInterval(
    runScheduler,
    60000
  );
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  startTournament,
  finishExpiredTournament,
  createNextRound,
  scheduleNextRound,
  processScheduledTournaments,
  startTournamentScheduler
};
