const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    entryFee: {
      type: Number,
      required: true,
      enum: [2, 10]
    },

    durationHours: {
      type: Number,
      required: true
    },

    winCondition: {
      type: String,
      enum: [
        "highest_balance",
        "target_race"
      ],
      required: true
    },

    targetAmount: {
      type: Number,
      default: null
    },

    targetSetByAI: {
      type: Boolean,
      default: false
    },

    startingDemoBalance: {
      type: Number,
      default: 500
    },

    games: {
      type: [String],
      enum: [
        "crash",
        "coin_flip",
        "dice_cup",
        "dragon_net"
      ],
      default: [
        "crash",
        "coin_flip",
        "dice_cup",
        "dragon_net"
      ]
    },

    // 50% of collected entry fees.
    // This is the amount shown publicly as the prize pool.
    prizePool: {
      type: Number,
      default: 0
    },

    // 50% of collected entry fees.
    // Internal platform accounting.
    platformShare: {
      type: Number,
      default: 0
    },

    playerCount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "active",
        "finished",
        "cancelled"
      ],
      default: "waiting"
    },

    startsAt: {
      type: Date,
      default: null
    },

    endsAt: {
      type: Date,
      default: null
    },

    winnerCount: {
      type: Number,
      default: 1
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentEntry",
      default: null
    },

    platformKeepsPool: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Tournament",
  tournamentSchema
);
