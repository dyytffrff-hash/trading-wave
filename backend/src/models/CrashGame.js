const mongoose = require("mongoose");

const crashGameSchema = new mongoose.Schema(
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

    crashPoint: {
      type: Number,
      required: true,
      min: 1.01,
      max: 300
    },

    currentMultiplier: {
      type: Number,
      default: 1.00
    },

    status: {
      type: String,
      enum: [
        "running",
        "cashed_out",
        "crashed"
      ],
      default: "running"
    },

    cashOutMultiplier: {
      type: Number,
      default: null
    },

    winnings: {
      type: Number,
      default: 0
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    finishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CrashGame",
  crashGameSchema
);
