const crypto = require("crypto");

const Deposit = require("../models/Deposit");


// ==========================================
// CREATE DEPOSIT
// ==========================================

async function createDeposit({
  userId,
  tournamentId,
  amount,
  currency = "USD"
}) {

  // ========================================
  // VALIDATION
  // ========================================

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
    typeof amount !== "number" ||
    amount <= 0
  ) {
    throw new Error(
      "Invalid deposit amount"
    );
  }

  const allowedCurrencies = [
    "USD",
    "USDT",
    "NGN"
  ];

  if (
    !allowedCurrencies.includes(
      currency
    )
  ) {
    throw new Error(
      "Unsupported currency"
    );
  }


  // ========================================
  // GENERATE UNIQUE PAYMENT REFERENCE
  // ========================================

  const paymentReference =
    `DEP-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;


  // ========================================
  // CREATE PENDING DEPOSIT
  // ========================================

  const deposit =
    await Deposit.create({

      userId,

      tournamentId,

      amount,

      currency,

      paymentReference,

      status: "pending",

      usedForEntry: false
    });


  // ========================================
  // RETURN SAFE PAYMENT DATA
  // ========================================

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
        deposit.status
    }
  };
}


// ==========================================
// GET DEPOSIT
// ==========================================

async function getDeposit(
  depositId
) {

  if (!depositId) {
    throw new Error(
      "depositId is required"
    );
  }

  const deposit =
    await Deposit.findById(
      depositId
    );

  if (!deposit) {
    throw new Error(
      "Deposit not found"
    );
  }

  return deposit;
}


module.exports = {
  createDeposit,
  getDeposit
};
