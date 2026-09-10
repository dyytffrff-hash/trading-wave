const crypto = require("crypto");


// ==========================================
// RANDOM DIGITS
// ==========================================

function randomDigits(length) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += crypto.randomInt(0, 10).toString();
  }

  return result;
}


// ==========================================
// GENERATE WINNER CODE
// ==========================================

function generateWinnerCode(rank, winnerCount) {
  let prefix;
  let digits;

  if (winnerCount === 1) {
    prefix = "TWF";
    digits = 5;
  }

  else if (winnerCount === 2) {
    if (rank === 1) {
      prefix = "TWF";
      digits = 6;
    } else {
      prefix = "TWS";
      digits = 5;
    }
  }

  else if (winnerCount === 3) {
    if (rank === 1) {
      prefix = "TWF";
      digits = 7;
    }

    else if (rank === 2) {
      prefix = "TWS";
      digits = 6;
    }

    else {
      prefix = "TWT";
      digits = 5;
    }
  }

  else {
    throw new Error(
      "Invalid winner count"
    );
  }

  return prefix + randomDigits(digits);
}


// ==========================================
// HASH WINNER CODE
// ==========================================

function hashWinnerCode(code) {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
}


// ==========================================
// VERIFY WINNER CODE
// ==========================================

function verifyWinnerCode(
  code,
  storedHash
) {
  const submittedHash =
    hashWinnerCode(code);

  return crypto.timingSafeEqual(
    Buffer.from(submittedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}


module.exports = {
  generateWinnerCode,
  hashWinnerCode,
  verifyWinnerCode
};
