const User = require("../models/User");

const PAYMENT_API_URL =
  process.env.PAYMENT_API_URL ||
  "http://localhost:5000";

async function registerWinnerWithPayment({
  entry,
  tournament,
  winnerCount
}) {
  if (!entry) {
    throw new Error("Winner entry is required");
  }

  if (!tournament) {
    throw new Error("Tournament is required");
  }

  const user =
    await User.findById(entry.user).select(
      "telegramId"
    );

  if (!user) {
    throw new Error("Winner user not found");
  }

  const response =
    await fetch(
      `${PAYMENT_API_URL}/api/winner/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "x-main-backend-key":
            process.env.MAIN_BACKEND_API_KEY
        },

        body: JSON.stringify({
          userId:
            entry.user.toString(),

          tournamentId:
            tournament._id.toString(),

          prizeAmount:
            Number(entry.prizeAmount),

          rank:
            Number(entry.rank),

          winnerCount:
            Number(winnerCount),

          telegramId:
            user.telegramId || null
        })
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
      "Payment winner registration failed"
    );
  }

  return result;
}

module.exports = {
  registerWinnerWithPayment
};
