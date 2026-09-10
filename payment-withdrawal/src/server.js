require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB =
  require("./config/db");

const winnerRouter =
  require("./routes/winner");
const withdrawalRouter =
  require("./routes/withdrawal");
const adminWithdrawalRouter =
  require("./routes/adminWithdrawal");
const depositRouter = require("./routes/deposit");

const app = express();


// ==========================================
// SECURITY
// ==========================================

app.use(
  helmet()
);

app.use(
  cors()
);

app.use(
  express.json({
    limit: "100kb"
  })
);


// ==========================================
// RATE LIMIT
// ==========================================

const limiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

app.use(limiter);


// ==========================================
// HEALTH
// ==========================================

app.get(
  "/health",
  (req, res) => {
    res.json({
      success: true,
      service:
        "Trading Wave Payment + Withdrawal",
      status: "ok"
    });
  }
);


// ==========================================
// WINNER API
// ==========================================

app.use(
  "/api/winner",
  winnerRouter
);
app.use(
  "/api/withdrawal",
  withdrawalRouter
);
app.use(
  "/api/admin",
  adminWithdrawalRouter
);
app.use(
  "/api/deposit",
  depositRouter
);


// ==========================================
// START
// ==========================================

const PORT =
  process.env.PORT || 5000;


async function startServer() {

  try {

    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `Payment + Withdrawal API running on port ${PORT}`
        );
      }
    );

  } catch (error) {

    console.error(
      "Payment server startup error:",
      error.message
    );

    process.exit(1);
  }
}


startServer();
