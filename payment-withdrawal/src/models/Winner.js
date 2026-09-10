const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    // User from the main Trading Wave system
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Tournament from the main Trading Wave system
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Official prize determined by the main system
    prizeAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Winner's rank
    rank: {
      type: Number,
      required: true,
      min: 1
    },

    // Secure hash of the private winner code
    winnerCodeHash: {
      type: String,
      required: true
    },

    // Prevents the same code from being claimed twice
    winnerCodeUsed: {
      type: Boolean,
      default: false
    },

    // Controls the winner's withdrawal eligibility
    claimStatus: {
      type: String,
      enum: [
        "available",
        "pending",
        "processing",
        "completed",
        "cancelled"
      ],
      default: "available"
    },

    // Whether this record represents a verified winner
    isWinner: {
      type: Boolean,
      default: true
    },

    // Optional Telegram information
    telegramId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// A user should not have duplicate winner records
// for the same tournament.
winnerSchema.index(
  {
    userId: 1,
    tournamentId: 1
  },
  {
    unique: true
  }
);


module.exports = mongoose.model(
  "Winner",
  winnerSchema
);
