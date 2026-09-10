const PAYMENT_API_URL =
  process.env.PAYMENT_API_URL ||
  "http://localhost:5000";

const MAIN_BACKEND_API_KEY =
  process.env.MAIN_BACKEND_API_KEY;


// ==========================================
// VERIFY CONFIRMED DEPOSIT
// ==========================================

async function verifyConfirmedDeposit({
  depositId,
  userId,
  tournamentId,
  amount
}) {

  if (!depositId) {
    throw new Error(
      "depositId is required"
    );
  }

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
      "Invalid payment amount"
    );
  }

  if (!MAIN_BACKEND_API_KEY) {
    throw new Error(
      "MAIN_BACKEND_API_KEY is missing"
    );
  }


  // ========================================
  // ASK PAYMENT SERVICE
  // ========================================

  const response = await fetch(
    `${PAYMENT_API_URL}/api/deposit/verify`,
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
        tournamentId,
        amount
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
      "Payment verification failed"
    );
  }


  if (
    !result.success ||
    !result.deposit
  ) {
    throw new Error(
      "Payment was not verified"
    );
  }


  return result;
}


module.exports = {
  verifyConfirmedDeposit
};
