const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    // Trading Wave user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Tournament the payment is intended for
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Expected entry fee
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    // Currency used for the payment
    currency: {
      type: String,
      enum: ["USD", "USDT", "NGN"],
      required: true
    },

    // Unique internal payment reference
    paymentReference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Provider transaction reference
    providerReference: {
      type: String,
      default: null,
      index: true
    },

    // Payment status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "failed",
        "cancelled"
      ],
      default: "pending",
      index: true
    },

    // Prevent the same confirmed payment
    // from being used more than once.
    usedForEntry: {
      type: Boolean,
      default: false
    },

    // When payment was confirmed
    confirmedAt: {
      type: Date,
      default: null
    },

    // Optional provider/payment information
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    // Internal/admin note
    adminNote: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// A user can have many deposits,
// but every payment reference is unique.
depositSchema.index({
  userId: 1,
  createdAt: -1
});


module.exports = mongoose.model(
  "Deposit",
  depositSchema
);
