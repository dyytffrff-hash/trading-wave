require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const telegramBot =
  require("./bot/telegram");

const authRouter =
  require("./routes/auth");

const gamesRouter =
  require("./routes/games");

const entriesRouter =
  require("./routes/entries");

const tournamentsRouter =
  require("./routes/tournaments");

const leaderboardRouter =
  require("./routes/leaderboard");

const {
  startTournamentScheduler
} = require("./services/roundManager");


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Trading Wave API running"
  });
});


app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected"
  });
});


// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRouter
);

app.use(
  "/api/games",
  gamesRouter
);

app.use(
  "/api/entries",
  entriesRouter
);

app.use(
  "/api/tournaments",
  tournamentsRouter
);

app.use(
  "/api/leaderboard",
  leaderboardRouter
);


// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 4000;


async function startServer() {

  try {

    await connectDB();


    telegramBot.catch(
      (error) => {

        console.error(
          "Telegram update error:",
          error.message
        );

      }
    );


    telegramBot.launch({
      dropPendingUpdates: true
    })
    .catch((error) => {

      console.error(
        "Telegram bot startup error:",
        error.message
      );

    });


    console.log(
      "Trading Wave Telegram bot starting..."
    );


    // startTournamentScheduler();


    app.listen(
      PORT,
      () => {

        console.log(
          `Trading Wave API running on port ${PORT}`
        );

      }
    );

  } catch(error) {

    console.error(
      "Server startup error:",
      error.message
    );

    process.exit(1);

  }

}


startServer();
module.exports = app;
