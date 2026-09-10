const crypto = require("crypto");

const Winner = require("../models/Winner");
const Withdrawal = require("../models/Withdrawal");

const {
  hashWinnerCode
} = require("../utils/winnerCode");


// ==========================================
// REQUEST WITHDRAWAL
// ==========================================

async function requestWithdrawal({
  userId,
  winnerCode,
  paymentMethod,
  paymentDetails
}) {

  // ========================================
  // BASIC VALIDATION
  // ========================================

  if (!userId) {
    throw new Error("userId is required");
  }

  if (!winnerCode) {
    throw new Error("Winner code is required");
  }

  if (!paymentMethod) {
    throw new Error(
      "Payment method is required"
    );
  }

  if (!paymentDetails) {
    throw new Error(
      "Payment account details are required"
    );
  }


  // ========================================
  // FIND WINNER
  // ========================================

  const winners =
    await Winner.find({
      userId,
      isWinner: true
    });

  if (!winners.length) {
    throw new Error(
      "You are not a verified winner"
    );
  }


  // ========================================
  // FIND MATCHING CODE
  // ========================================

  let matchedWinner = null;

  const submittedHash =
    hashWinnerCode(
      winnerCode
    );

  for (const winner of winners) {

    if (
      winner.winnerCodeHash ===
      submittedHash
    ) {
      matchedWinner = winner;
      break;
    }
  }


  if (!matchedWinner) {
    throw new Error(
      "Invalid or expired winner code"
    );
  }


  // ========================================
  // CODE ALREADY USED
  // ========================================

  if (
    matchedWinner.winnerCodeUsed
  ) {
    throw new Error(
      "Invalid or expired winner code"
    );
  }


  // ========================================
  // CLAIM STATUS
  // ========================================

  if (
    matchedWinner.claimStatus !==
    "available"
  ) {
    throw new Error(
      "Prize is not available for withdrawal"
    );
  }


  // ========================================
  // PREVENT DUPLICATE WITHDRAWAL
  // ========================================

  const existingWithdrawal =
    await Withdrawal.findOne({
      winnerId:
        matchedWinner._id
    });

  if (existingWithdrawal) {
    throw new Error(
      "Withdrawal request already exists"
    );
  }


  // ========================================
  // CREATE WITHDRAWAL
  // ========================================

  const withdrawal =
    await Withdrawal.create({

      userId,

      winnerId:
        matchedWinner._id,

      tournamentId:
        matchedWinner.tournamentId,

      prizeAmount:
        matchedWinner.prizeAmount,

      paymentMethod,

      paymentDetails,

      status: "pending",

      withdrawalReference:
        `WD-${Date.now()}-${crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase()}`
    });


  // ========================================
  // LOCK WINNER CODE
  // ========================================

  matchedWinner.winnerCodeUsed =
    true;

  matchedWinner.claimStatus =
    "processing";

  await matchedWinner.save();


  return {
    success: true,

    withdrawal: {
      id:
        withdrawal._id,

      reference:
        withdrawal.withdrawalReference,

      userId:
        withdrawal.userId,

      tournamentId:
        withdrawal.tournamentId,

      prizeAmount:
        withdrawal.prizeAmount,

      paymentMethod:
        withdrawal.paymentMethod,

      status:
        withdrawal.status
    }
  };
}


module.exports = {
  requestWithdrawal
};
