const Tournament = require("../models/Tournament");
const TournamentEntry = require("../models/TournamentEntry");
const {
  registerWinnerWithPayment
} = require("./paymentWinnerService");

// ==========================================
// DETERMINE WINNER COUNT
// ==========================================

function getWinnerCount(playerCount) {
  if (playerCount >= 500) {
    return 3;
  }

  if (playerCount >= 300) {
    return 2;
  }

  if (playerCount >= 5) {
    return 1;
  }

  return 0;
}


// ==========================================
// GENERATE CLAIM CODE
// ==========================================

function generateClaimCode(length) {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    const index =
      Math.floor(
        Math.random() * characters.length
      );

    code += characters[index];
  }

  return code;
}


// ==========================================
// GENERATE WINNER CODE
//
// 1 winner:
// 5 characters
//
// 2 winners:
// Winner 1 = 6 characters
// Winner 2 = 5 characters
//
// 3 winners:
// Winner 1 = 7 characters
// Winner 2 = 6 characters
// Winner 3 = 5 characters
// ==========================================

function getClaimCodeLength(
  winnerRank,
  winnerCount
) {
  if (winnerCount === 1) {
    return 5;
  }

  if (winnerCount === 2) {
    return winnerRank === 1 ? 6 : 5;
  }

  if (winnerCount === 3) {
    if (winnerRank === 1) {
      return 7;
    }

    if (winnerRank === 2) {
      return 6;
    }

    return 5;
  }

  return 5;
}


// ==========================================
// CREATE UNIQUE CLAIM CODE
// ==========================================

async function createUniqueClaimCode(
  length
) {
  let code;
  let exists = true;

  while (exists) {
    code = generateClaimCode(length);

    exists =
      await TournamentEntry.exists({
        claimCode: code
      });
  }

  return code;
}


// ==========================================
// SETTLE $2 STARTER TOURNAMENT
// ==========================================

async function settleStarterTournament(
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

  if (tournament.entryFee !== 2) {
    throw new Error(
      "This settlement service is only for the $2 tournament"
    );
  }


  // ========================================
  // GET ACTIVE ENTRIES
  // ========================================

  const entries =
    await TournamentEntry.find({
      tournament: tournamentId
    }).sort({
      demoBalance: -1,
      updatedAt: 1
    });

  const playerCount =
    entries.length;

  const winnerCount =
    getWinnerCount(
      playerCount
    );


  // ========================================
  // NOT ENOUGH PLAYERS
  // ========================================

  if (winnerCount === 0) {

    tournament.status =
      "finished";

    tournament.winnerCount =
      0;

    tournament.platformKeepsPool =
      false;

    tournament.platformShare =
      0;

    if (!tournament.endsAt) {
      tournament.endsAt =
        new Date();
    }

    await tournament.save();


    // Finish all entries.
    await TournamentEntry.updateMany(
      {
        tournament: tournamentId,
        status: "active"
      },
      {
        $set: {
          status: "finished"
        }
      }
    );


    return {
      success: true,
      settled: false,
      tournamentFinished: true,
      reason:
        "Not enough players. Minimum is 5.",
      playerCount,
      winnerCount: 0
    };
  }


  // ========================================
  // TOTAL MONEY COLLECTED
  // ========================================

  const totalCollected =
    Number(
      tournament.prizePool || 0
    );


  // ========================================
  // 50 / 50 SPLIT
  //
  // 50% = winners
  // 50% = platform
  // ========================================

  const publicPrizePool =
  Number(
    totalCollected.toFixed(2)
  );

const platformShare =
  Number(
    (
      tournament.platformShare || 0
    ).toFixed(2)
  );


  // ========================================
  // CALCULATE PRIZE PER WINNER
  // ========================================

 const prizePercentages = {
  1: [1.00],
  2: [0.80, 0.20],
  3: [0.70, 0.20, 0.10]
};

const winnerPercentages =
  prizePercentages[winnerCount];

if (!winnerPercentages) {
  throw new Error(
    "Invalid winner count"
  );
}

  // ========================================
  // SELECT WINNERS
  // ========================================

  const winners =
    entries.slice(
      0,
      winnerCount
    );


  // ========================================
  // MARK WINNERS + ASSIGN PRIZE + CODE
  // ========================================

  for (
    let i = 0;
    i < winners.length;
    i++
  ) {

    const winner =
      winners[i];

    const rank =
      i + 1;

    const codeLength =
      getClaimCodeLength(
        rank,
        winnerCount
      );

    const claimCode =
      await createUniqueClaimCode(
        codeLength
      );


    winner.status =
      "winner";

    winner.rank =
      rank;

winner.prizeAmount =
  Number(
    (
      totalCollected *
      winnerPercentages[i]
    ).toFixed(2)
  );

    winner.claimCode =
      claimCode;

    winner.claimCodeUsed =
      false;

    await winner.save();
  }
const paymentWinner =
  await registerWinnerWithPayment({
    entry: winner,
    tournament,
    winnerCount
  });

  // ========================================
  // FINISH ALL NON-WINNERS
  // ========================================

  const winnerIds =
    winners.map(
      (entry) =>
        entry._id
    );

  await TournamentEntry.updateMany(
    {
      tournament: tournamentId,
      status: "active",
      _id: {
        $nin: winnerIds
      }
    },
    {
      $set: {
        status: "finished"
      }
    }
  );


  // ========================================
  // FINISH TOURNAMENT
  // ========================================

  tournament.status =
    "finished";

  tournament.winnerCount =
    winnerCount;

  /*
   * Store the platform's 50% internally.
   *
   * tournament.prizePool remains the
   * total amount collected.
   */
  tournament.platformShare =
    platformShare;


  /*
   * Tournament.winner is only used
   * when there is exactly one winner.
   *
   * Multiple winners are stored through
   * TournamentEntry.rank.
   */
  if (winnerCount === 1) {

    tournament.winner =
      winners[0]._id;

  } else {

    tournament.winner =
      null;
  }


  /*
   * This does NOT mean the platform keeps
   * 100% of the prizePool.
   *
   * The platform keeps only the calculated
   * 50% stored in platformShare.
   */
  tournament.platformKeepsPool =
    false;

  await tournament.save();


  // ========================================
  // RETURN SETTLEMENT RESULT
  // ========================================

  return {
    success: true,
    settled: true,
    tournamentFinished: true,

    playerCount,

    winnerCount,

    totalCollected,

    publicPrizePool,

    platformShare,


    winners:
      winners.map(
        (entry) => ({
          entryId:
            entry._id,

          rank:
            entry.rank,

          demoBalance:
            entry.demoBalance,

          prizeAmount:
            entry.prizeAmount,

          claimCode:
            entry.claimCode
        })
      )
  };
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getWinnerCount,
  settleStarterTournament
};
