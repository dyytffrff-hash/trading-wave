const mongoose = require("mongoose");

const dragonNetGameSchema = new mongoose.Schema(
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

    totalHoles: {
      type: Number,
      default: 20
    },

    dragonCount: {
      type: Number,
      default: 6
    },

    dragonHoles: {
      type: [Number],
      required: true
    },

    selectedHoles: {
      type: [Number],
      default: []
    },

    safeHoles: {
      type: Number,
      default: 0
    },

    currentMultiplier: {
      type: Number,
      default: 0
    },

    currentCashout: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "playing",
        "cashed_out",
        "lost"
      ],
      default: "playing"
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
  "DragonNetGame",
  dragonNetGameSchema
);
