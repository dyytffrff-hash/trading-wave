const Tournament = require("../models/Tournament");
const TournamentEntry = require("../models/TournamentEntry");
const {
  scheduleNextRound
} = require("./roundManager");

async function checkTarget(entryId) {
  const entry = await TournamentEntry.findById(entryId);

  if (!entry) {
    throw new Error("Tournament entry not found");
  }

  const tournament = await Tournament.findById(
    entry.tournament
  );

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  // This service is only for the $10 target tournament.
  if (
    tournament.entryFee !== 10 ||
    tournament.winCondition !== "target_race"
  ) {
    return {
      won: false,
      reason: "This tournament does not use a target"
    };
  }

  // Tournament already closed.
  if (tournament.status !== "active") {
    return {
      won: false,
      reason: "Tournament is closed"
    };
  }

  // Target has not been selected yet.
  if (!tournament.targetAmount) {
    return {
      won: false,
      reason: "Target has not been set"
    };
  }

  // Check whether the 24-hour period has ended.
  if (
    tournament.endsAt &&
    new Date() >= tournament.endsAt
  ) {
    const expiredTournament =
      await Tournament.findOneAndUpdate(
        {
          _id: tournament._id,
          status: "active",
          winner: null
        },
        {
          $set: {
            status: "finished",
            platformKeepsPool: true
          }
        },
        {
          new: true
        }
      );

    if (expiredTournament) {
      console.log(
        `Tournament ${tournament._id} expired without a winner.`
      );

      try {
        await scheduleNextRound(expiredTournament);

        console.log(
          `Next $10 tournament scheduled after settlement.`
        );
      } catch (error) {
        console.error(
          "Could not schedule next tournament:",
          error.message
        );
      }
    }

    return {
      won: false,
      reason: "Tournament time has ended"
    };
  }

  // Player must reach OR exceed the target.
  if (
    entry.demoBalance <
    tournament.targetAmount
  ) {
    return {
      won: false,
      reason: "Target not reached",
      currentBalance: entry.demoBalance,
      target: tournament.targetAmount
    };
  }

  /*
   * Only ONE player can win.
   *
   * The database query requires:
   * - tournament is still active
   * - winner is still null
   *
   * If another player already won, this update
   * returns null.
   */
  const updatedTournament =
    await Tournament.findOneAndUpdate(
      {
        _id: tournament._id,
        status: "active",
        winner: null
      },
      {
        $set: {
          status: "finished",
          winner: entry._id
        }
      },
      {
        new: true
      }
    );

  // Someone else won first.
  if (!updatedTournament) {
    return {
      won: false,
      reason: "Another player already won"
    };
  }

  // Mark this entry as the winner.
  entry.status = "winner";
  entry.rank = 1;

  await entry.save();

  console.log(
    `Winner found for tournament ${tournament._id}: ${entry._id}`
  );

  /*
   * The tournament is now closed immediately.
   *
   * The next round will be created after the
   * 5-minute settlement period.
   */
  try {
    await scheduleNextRound(updatedTournament);

    console.log(
      "Next tournament scheduled after settlement."
    );
  } catch (error) {
    console.error(
      "Could not schedule next tournament:",
      error.message
    );
  }

  return {
    won: true,
    winner: entry._id,
    target: tournament.targetAmount,
    finalBalance: entry.demoBalance
  };
}

module.exports = {
  checkTarget
};

