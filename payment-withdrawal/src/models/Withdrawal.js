const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    // Trading Wave user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Winner record
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Winner",
      required: true,
      index: true
    },

    // Tournament reference
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Amount comes from the verified Winner record.
    // Never trust the amount supplied by the frontend.
    prizeAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Payment method selected by the winner
    paymentMethod: {
      type: String,
      enum: [
        "usdt_trc20",
        "usdt_bsc",
        "grey_to_grey",
        "bank_transfer",
        "debit_card"
      ],
      required: true
    },

    // Payment destination supplied by the winner
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    // Withdrawal processing state
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled"
      ],
      default: "pending",
      index: true
    },

    // Admin notes
    adminNote: {
      type: String,
      default: null
    },

    // Grey.co transaction/reference ID
    providerReference: {
      type: String,
      default: null
    },

    // When the admin/provider completes payment
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// Only one active withdrawal should exist
// for a winner at a time.
withdrawalSchema.index(
  {
    winnerId: 1,
    status: 1
  }
);


module.exports = mongoose.model(
  "Withdrawal",
  withdrawalSchema
);
