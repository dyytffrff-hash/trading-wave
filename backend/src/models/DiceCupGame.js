const mongoose = require("mongoose");

const diceCupGameSchema = new mongoose.Schema(
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

    selectedCup: {
      type: Number,
      enum: [1, 2],
      required: true
    },

    diceCup: {
      type: Number,
      enum: [1, 2],
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
  "DiceCupGame",
  diceCupGameSchema
);
