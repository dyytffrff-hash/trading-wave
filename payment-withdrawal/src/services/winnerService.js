const Winner = require("../models/Winner");

const {
  generateWinnerCode,
  hashWinnerCode
} = require("../utils/winnerCode");


// ==========================================
// REGISTER WINNER
// ==========================================

async function registerWinner({
  userId,
  tournamentId,
  prizeAmount,
  rank,
  winnerCount,
  telegramId
}) {

  if (!userId) {
    throw new Error(
      "userId is required"
    );
  }

  if (!tournamentId) {
    throw new Error(
      "tournamentId is required"
    );
  }

  if (
    typeof prizeAmount !== "number" ||
    prizeAmount <= 0
  ) {
    throw new Error(
      "Invalid prize amount"
    );
  }

  if (
    !Number.isInteger(rank) ||
    rank < 1
  ) {
    throw new Error(
      "Invalid winner rank"
    );
  }

  if (
    !Number.isInteger(winnerCount) ||
    ![1, 2, 3].includes(
      winnerCount
    )
  ) {
    throw new Error(
      "Invalid winner count"
    );
  }

  if (rank > winnerCount) {
    throw new Error(
      "Winner rank exceeds winner count"
    );
  }


  // ========================================
  // PREVENT DUPLICATE WINNER
  // ========================================

  const existingWinner =
    await Winner.findOne({
      userId,
      tournamentId
    });

  if (existingWinner) {
    throw new Error(
      "Winner already registered"
    );
  }


  // ========================================
  // GENERATE PRIVATE CODE
  // ========================================

  const winnerCode =
    generateWinnerCode(
      rank,
      winnerCount
    );

  const winnerCodeHash =
    hashWinnerCode(
      winnerCode
    );


  // ========================================
  // CREATE WINNER RECORD
  // ========================================

  const winner =
    await Winner.create({
      userId,
      tournamentId,
      prizeAmount,
      rank,
      winnerCodeHash,
      winnerCodeUsed: false,
      claimStatus: "available",
      isWinner: true,
      telegramId:
        telegramId || null
    });


  // ========================================
  // RETURN CODE ONCE
  // ========================================

  return {
    success: true,

    winner: {
      id:
        winner._id,

      userId:
        winner.userId,

      tournamentId:
        winner.tournamentId,

      prizeAmount:
        winner.prizeAmount,

      rank:
        winner.rank,

      claimStatus:
        winner.claimStatus,

      isWinner:
        winner.isWinner
    },

    // This is the only time
    // the raw code is returned.
    winnerCode
  };
}


module.exports = {
  registerWinner
};
