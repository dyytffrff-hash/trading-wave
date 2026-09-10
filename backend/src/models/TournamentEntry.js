const mongoose = require("mongoose");

const tournamentEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true
    },

    entryFee: {
      type: Number,
      required: true
    },

    demoBalance: {
      type: Number,
      default: 500
    },

    startingBalance: {
      type: Number,
      default: 500
    },

    status: {
      type: String,
      enum: [
        "active",
        "finished",
        "winner",
        "eliminated"
      ],
      default: "active"
    },

    rank: {
      type: Number,
      default: null
    },

    // ========================================
    // WINNER PRIZE
    // ========================================

    prizeAmount: {
      type: Number,
      default: 0
    },

    // ========================================
    // WINNER CLAIM CODE
    // ========================================

    claimCode: {
      type: String,
      default: null
    },

    claimCodeUsed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "TournamentEntry",
  tournamentEntrySchema
);
