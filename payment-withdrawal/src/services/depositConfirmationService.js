const Deposit = require("../models/Deposit");


// ==========================================
// CONFIRM DEPOSIT
// ==========================================

async function confirmDeposit({
  depositId,
  paymentReference,
  amount
}) {

  if (!depositId) {
    throw new Error(
      "depositId is required"
    );
  }

  if (!paymentReference) {
    throw new Error(
      "paymentReference is required"
    );
  }

  if (
    typeof amount !== "number" ||
    amount <= 0
  ) {
    throw new Error(
      "Invalid payment amount"
    );
  }


  // ========================================
  // FIND DEPOSIT
  // ========================================

  const deposit =
    await Deposit.findById(
      depositId
    );

  if (!deposit) {
    throw new Error(
      "Deposit not found"
    );
  }


  // ========================================
  // PREVENT DOUBLE CONFIRMATION
  // ========================================

  if (
    deposit.status ===
    "confirmed"
  ) {
    throw new Error(
      "Deposit is already confirmed"
    );
  }


  // ========================================
  // ONLY PENDING PAYMENTS
  // ========================================

  if (
    deposit.status !==
    "pending"
  ) {
    throw new Error(
      `Deposit cannot be confirmed from status: ${deposit.status}`
    );
  }


  // ========================================
  // VERIFY PAYMENT REFERENCE
  // ========================================

  if (
    deposit.paymentReference !==
    paymentReference
  ) {
    throw new Error(
      "Payment reference does not match"
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
      "Payment amount does not match deposit amount"
    );
  }


  // ========================================
  // CONFIRM
  // ========================================

  deposit.status =
    "confirmed";

  deposit.confirmedAt =
    new Date();

  await deposit.save();


  return {
    success: true,

    deposit: {
      id:
        deposit._id,

      userId:
        deposit.userId,

      tournamentId:
        deposit.tournamentId,

      amount:
        deposit.amount,

      currency:
        deposit.currency,

      paymentReference:
        deposit.paymentReference,

      status:
        deposit.status,

      confirmedAt:
        deposit.confirmedAt
    }
  };
}


module.exports = {
  confirmDeposit
};
