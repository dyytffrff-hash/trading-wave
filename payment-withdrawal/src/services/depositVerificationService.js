const Deposit = require("../models/Deposit");


// ==========================================
// VERIFY CONFIRMED DEPOSIT
// ==========================================

async function verifyDeposit({
  depositId,
  userId,
  tournamentId,
  amount
}) {

  if (!depositId) {
    throw new Error("depositId is required");
  }

  if (!userId) {
    throw new Error("userId is required");
  }

  if (!tournamentId) {
    throw new Error("tournamentId is required");
  }

  if (
    typeof amount !== "number" ||
    amount <= 0
  ) {
    throw new Error("Invalid payment amount");
  }


  // ========================================
  // FIND DEPOSIT
  // ========================================

  const deposit =
    await Deposit.findById(depositId);

  if (!deposit) {
    throw new Error("Deposit not found");
  }


  // ========================================
  // VERIFY USER
  // ========================================

  if (
    deposit.userId.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "Deposit does not belong to this user"
    );
  }


  // ========================================
  // VERIFY TOURNAMENT
  // ========================================

  if (
    deposit.tournamentId.toString() !==
    tournamentId.toString()
  ) {
    throw new Error(
      "Deposit does not belong to this tournament"
    );
  }


  // ========================================
  // VERIFY AMOUNT
  // ========================================

  if (
    Number(deposit.amount) !==
    Number(amount)
  ) {
    throw new Error(
      "Deposit amount does not match"
    );
  }


  // ========================================
  // PAYMENT MUST BE CONFIRMED
  // ========================================

  if (
    deposit.status !==
    "confirmed"
  ) {
    throw new Error(
      "Payment has not been confirmed"
    );
  }


  // ========================================
  // PREVENT PAYMENT REUSE
  // ========================================

  if (deposit.usedForEntry) {
    throw new Error(
      "This payment has already been used"
    );
  }


  // ========================================
  // IMPORTANT
  // ========================================
  // Do NOT mark the payment as used here.
  //
  // Verification only confirms that the
  // payment is valid.
  //
  // The main backend should mark it as used
  // AFTER the tournament entry is successfully
  // created.
  // ========================================


  return {
    success: true,

    deposit: {
      id: deposit._id,
      userId: deposit.userId,
      tournamentId: deposit.tournamentId,
      amount: deposit.amount,
      currency: deposit.currency,
      paymentReference:
        deposit.paymentReference,
      status: deposit.status,
      usedForEntry:
        deposit.usedForEntry,
      confirmedAt:
        deposit.confirmedAt
    }
  };
}


module.exports = {
  verifyDeposit
};
