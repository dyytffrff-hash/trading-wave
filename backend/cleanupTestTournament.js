require("dotenv").config();

const mongoose = require("mongoose");
const Tournament = require("./src/models/Tournament");
const TournamentEntry = require("./src/models/TournamentEntry");

const tournamentId =
  "6a8488ac8ba54b4d9b25d009";

async function cleanup() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected");

    const entries =
      await TournamentEntry.deleteMany({
        tournament: tournamentId
      });

    const tournament =
      await Tournament.findByIdAndDelete(
        tournamentId
      );

    console.log(
      "Entries removed:",
      entries.deletedCount
    );

    console.log(
      "Tournament removed:",
      !!tournament
    );

    await mongoose.disconnect();

  } catch (error) {
    console.error(
      "Cleanup error:",
      error.message
    );

    process.exit(1);
  }
}

cleanup();
