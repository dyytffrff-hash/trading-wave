const TournamentEntry = require("../models/TournamentEntry");
const Tournament = require("../models/Tournament");

const {
  verifyConfirmedDeposit
} = require("./paymentVerificationService");

const PRIZE_POOL_PERCENT = 0.50;
const PLATFORM_SHARE_PERCENT = 0.50;

const PAYMENT_API_URL =
  process.env.PAYMENT_API_URL ||
  "http://localhost:5000";

const MAIN_BACKEND_API_KEY =
  process.env.MAIN_BACKEND_API_KEY;


// ==========================================
// MARK PAYMENT USED
// ==========================================

async function markPaymentUsed({
  depositId,
  userId,
  tournamentId
}) {

  if (!MAIN_BACKEND_API_KEY) {
    throw new Error(
      "MAIN_BACKEND_API_KEY is missing"
    );
  }

  const response = await fetch(
    `${PAYMENT_API_URL}/api/deposit/use-for-entry`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "x-main-backend-key":
          MAIN_BACKEND_API_KEY
      },

      body: JSON.stringify({
        depositId,
        userId,
        tournamentId
      })
    }
  );


  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Payment service returned an invalid response"
    );
  }


  if (!response.ok) {
    throw new Error(
      result.error ||
      "Could not mark payment as used"
    );
  }


  if (!result.success) {
    throw new Error(
      "Payment was not marked as used"
    );
  }


  return result;
}


// ==========================================
// JOIN TOURNAMENT
// ==========================================

async function joinTournament(
  userId,
  tournamentId,
  depositId
) {

  // ========================================
  // FIND TOURNAMENT
  // ========================================

  const tournament =
    await Tournament.findById(
      tournamentId
    );

  if (!tournament) {
    throw new Error(
      "Tournament not found"
    );
  }


  // ========================================
  // PAYMENT REQUIRED
  // ========================================

  if (!depositId) {
    throw new Error(
      "A confirmed payment is required to join this tournament"
    );
  }


  // ========================================
  // CHECK TOURNAMENT STATUS
  // ========================================

  if (
    tournament.status !== "waiting" &&
    tournament.status !== "active"
  ) {
    throw new Error(
      "Tournament is not accepting entries"
    );
  }


  // ========================================
  // PREVENT DUPLICATE ENTRY
  // ========================================

  const existingEntry =
    await TournamentEntry.findOne({
      user: userId,
      tournament: tournamentId
    });

  if (existingEntry) {
    throw new Error(
      "You are already entered in this tournament"
    );
  }


  // ========================================
  // VERIFY PAYMENT
  // ========================================

  await verifyConfirmedDeposit({
    depositId,
    userId,
    tournamentId,
    amount:
      Number(tournament.entryFee)
  });


  // ========================================
  // STARTING DEMO BALANCE
  // ========================================

  const startingBalance =
    tournament.startingDemoBalance;


  // ========================================
  // CREATE TOURNAMENT ENTRY
  // ========================================

  const entry =
    await TournamentEntry.create({
      user: userId,
      tournament: tournamentId,
      entryFee: tournament.entryFee,
      demoBalance: startingBalance,
      startingBalance,
      status: "active"
    });


  // ========================================
  // CALCULATE 50 / 50 SPLIT
  // ========================================

  const prizeContribution =
    Number(
      (
        tournament.entryFee *
        PRIZE_POOL_PERCENT
      ).toFixed(2)
    );

  const platformContribution =
    Number(
      (
        tournament.entryFee *
        PLATFORM_SHARE_PERCENT
      ).toFixed(2)
    );


  // ========================================
  // UPDATE TOURNAMENT
  // ========================================

  tournament.playerCount += 1;

  tournament.prizePool +=
    prizeContribution;

  tournament.platformShare +=
    platformContribution;

  await tournament.save();


  // ========================================
  // MARK PAYMENT USED
  // ========================================
  //
  // This happens AFTER the entry has
  // successfully been created.
  //

  await markPaymentUsed({
    depositId,
    userId,
    tournamentId
  });


  // ========================================
  // SUCCESS
  // ========================================

  return {
    success: true,

    entry: {
      id:
        entry._id,

      user:
        entry.user,

      tournament:
        entry.tournament,

      entryFee:
        entry.entryFee,

      demoBalance:
        entry.demoBalance,

      startingBalance:
        entry.startingBalance,

      status:
        entry.status
    }
  };
}


// ==========================================
// GET ONE ENTRY
// ==========================================

async function getEntry(entryId) {

  const entry =
    await TournamentEntry.findById(
      entryId
    )
      .populate(
        "tournament",
        "name entryFee durationHours winCondition targetAmount startingDemoBalance status prizePool"
      );

  if (!entry) {
    throw new Error(
      "Tournament entry not found"
    );
  }

  return entry;
}


// ==========================================
// GET USER ENTRIES
// ==========================================

async function getUserEntries(userId) {

  return TournamentEntry.find({
    user: userId
  })
    .populate(
      "tournament",
      "name entryFee durationHours winCondition targetAmount startingDemoBalance status prizePool"
    )
    .sort({
      createdAt: -1
    });
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  joinTournament,
  getEntry,
  getUserEntries
};
