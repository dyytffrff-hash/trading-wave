const mongoose = require("mongoose");

const coinFlipGameSchema = new mongoose.Schema(
  {
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentEntry",
      required: true,
      index: true
    },

    betAmount: {
      type: Number,
      required: true,
      min: 50
    },

    choice: {
      type: String,
      enum: ["heads", "tails"],
      required: true
    },

    result: {
      type: String,
      enum: ["heads", "tails"],
      required: true
    },

    won: {
      type: Boolean,
      required: true
    },

    winnings: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["completed"],
      default: "completed"
    },

    playedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CoinFlipGame",
  coinFlipGameSchema
);
