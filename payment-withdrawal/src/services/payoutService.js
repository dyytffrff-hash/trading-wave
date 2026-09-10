const Withdrawal = require("../models/Withdrawal");
const Winner = require("../models/Winner");


// ==========================================
// START PAYOUT PROCESSING
// ==========================================

async function startPayout(withdrawalId) {

  if (!withdrawalId) {
    throw new Error(
      "withdrawalId is required"
    );
  }

  const withdrawal =
    await Withdrawal.findById(
      withdrawalId
    );

  if (!withdrawal) {
    throw new Error(
      "Withdrawal not found"
    );
  }


  // ========================================
  // ONLY PENDING WITHDRAWALS
  // ========================================

  if (
    withdrawal.status !== "pending"
  ) {
    throw new Error(
      "Withdrawal is not pending"
    );
  }


  // ========================================
  // MOVE TO PROCESSING
  // ========================================

  withdrawal.status =
    "processing";

  await withdrawal.save();


  return {
    success: true,
    status:
      withdrawal.status,
    withdrawalId:
      withdrawal._id
  };
}


// ==========================================
// COMPLETE PAYOUT
// ==========================================

async function completePayout(
  withdrawalId,
  providerReference = null
) {

  if (!withdrawalId) {
    throw new Error(
      "withdrawalId is required"
    );
  }

  const withdrawal =
    await Withdrawal.findById(
      withdrawalId
    );

  if (!withdrawal) {
    throw new Error(
      "Withdrawal not found"
    );
  }


  // ========================================
  // ONLY PROCESSING WITHDRAWALS
  // ========================================

  if (
    withdrawal.status !== "processing"
  ) {
    throw new Error(
      "Withdrawal must be processing"
    );
  }


  // ========================================
  // COMPLETE WITHDRAWAL
  // ========================================

  withdrawal.status =
    "completed";

  withdrawal.completedAt =
    new Date();

  if (providerReference) {
    withdrawal.providerReference =
      providerReference;
  }

  await withdrawal.save();


  // ========================================
  // COMPLETE WINNER CLAIM
  // ========================================

  const winner =
    await Winner.findById(
      withdrawal.winnerId
    );

  if (winner) {

    winner.claimStatus =
      "completed";

    await winner.save();

  }


  return {
    success: true,
    status:
      withdrawal.status,
    withdrawalId:
      withdrawal._id,
    providerReference:
      withdrawal.providerReference
  };
}


// ==========================================
// FAIL PAYOUT
// ==========================================

async function failPayout(
  withdrawalId,
  adminNote = null
) {

  if (!withdrawalId) {
    throw new Error(
      "withdrawalId is required"
    );
  }

  const withdrawal =
    await Withdrawal.findById(
      withdrawalId
    );

  if (!withdrawal) {
    throw new Error(
      "Withdrawal not found"
    );
  }


  // ========================================
  // ONLY PROCESSING WITHDRAWALS
  // ========================================

  if (
    withdrawal.status !== "processing"
  ) {
    throw new Error(
      "Withdrawal must be processing"
    );
  }


  // ========================================
  // MARK FAILED
  // ========================================

  withdrawal.status =
    "failed";

  if (adminNote) {
    withdrawal.adminNote =
      adminNote;
  }

  await withdrawal.save();


  // ========================================
  // RETURN WINNER TO AVAILABLE
  // ========================================

  const winner =
    await Winner.findById(
      withdrawal.winnerId
    );

  if (winner) {

    winner.claimStatus =
      "available";

    winner.winnerCodeUsed =
      false;

    await winner.save();

  }


  return {
    success: true,
    status:
      withdrawal.status,
    withdrawalId:
      withdrawal._id
  };
}


module.exports = {
  startPayout,
  completePayout,
  failPayout
};
