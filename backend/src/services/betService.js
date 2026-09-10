const TournamentEntry = require("../models/TournamentEntry");
const Tournament = require("../models/Tournament");
const { checkTarget } = require("./targetCheck");

const MIN_BET = 50;

async function placeBet(entryId, betAmount) {
  // Validate bet amount
  if (
    typeof betAmount !== "number" ||
    !Number.isFinite(betAmount)
  ) {
    throw new Error("Invalid bet amount");
  }

  if (betAmount < MIN_BET) {
    throw new Error(
      `Minimum bet is $${MIN_BET} DEMO`
    );
  }

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

  // Player cannot bet after winning/elimination.
  if (entry.status !== "active") {
    throw new Error(
      "This tournament entry is no longer active"
    );
  }

  // Tournament must be active.
  if (tournament.status !== "active") {
    throw new Error(
      "Tournament is not currently active"
    );
  }

  // Check tournament expiry before accepting the bet.
  if (
    tournament.endsAt &&
    new Date() >= tournament.endsAt
  ) {
    throw new Error(
      "Tournament time has ended"
    );
  }

  // Player must have enough DEMO money.
  if (entry.demoBalance < betAmount) {
    throw new Error(
      "Insufficient DEMO balance"
    );
  }

  /*
   * This service only reserves/deducts the bet.
   *
   * The individual game decides whether the player
   * wins or loses and calculates the final balance.
   */
  entry.demoBalance -= betAmount;

  await entry.save();

  return {
    success: true,
    entryId: entry._id,
    tournamentId: tournament._id,
    betAmount,
    demoBalance: entry.demoBalance
  };
}


/*
 * Add winnings back to the player's DEMO balance.
 *
 * Example:
 * Player bets $50 and wins a 2x game.
 * The game can call:
 *
 * addWinnings(entryId, 100)
 *
 * The player's balance increases by $100.
 */
async function addWinnings(entryId, amount) {
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    throw new Error("Invalid winnings amount");
  }

  const entry = await TournamentEntry.findById(entryId);

  if (!entry) {
    throw new Error("Tournament entry not found");
  }

  if (entry.status !== "active") {
    throw new Error(
      "Tournament entry is no longer active"
    );
  }

  const tournament = await Tournament.findById(
    entry.tournament
  );

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  if (tournament.status !== "active") {
    throw new Error(
      "Tournament is no longer active"
    );
  }

  entry.demoBalance += amount;

  await entry.save();

  // Check whether this balance reached the
  // target for a $10 tournament.
  let targetResult = null;

  if (
    tournament.entryFee === 10 &&
    tournament.winCondition === "target_race"
  ) {
    targetResult = await checkTarget(entry._id);
  }

  return {
    success: true,
    entryId: entry._id,
    tournamentId: tournament._id,
    winnings: amount,
    demoBalance: entry.demoBalance,
    targetResult
  };
}


/*
 * Return money to the player's DEMO balance.
 *
 * This can be used when a game is cancelled before
 * the result is finalized.
 */
async function refundBet(entryId, amount) {
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error("Invalid refund amount");
  }

  const entry = await TournamentEntry.findById(entryId);

  if (!entry) {
    throw new Error("Tournament entry not found");
  }

  if (entry.status !== "active") {
    throw new Error(
      "Tournament entry is no longer active"
    );
  }

  const tournament = await Tournament.findById(
    entry.tournament
  );

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  if (tournament.status !== "active") {
    throw new Error(
      "Tournament is no longer active"
    );
  }

  entry.demoBalance += amount;

  await entry.save();

  return {
    success: true,
    entryId: entry._id,
    refund: amount,
    demoBalance: entry.demoBalance
  };
}


async function getBalance(entryId) {
  const entry = await TournamentEntry.findById(entryId);

  if (!entry) {
    throw new Error("Tournament entry not found");
  }

  return {
    entryId: entry._id,
    tournamentId: entry.tournament,
    demoBalance: entry.demoBalance,
    status: entry.status
  };
}


module.exports = {
  placeBet,
  addWinnings,
  refundBet,
  getBalance
};
