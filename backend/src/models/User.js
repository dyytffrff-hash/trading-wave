const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    username: {
      type: String,
      default: null,
      trim: true
    },

    firstName: {
      type: String,
      default: null,
      trim: true
    },

    lastName: {
      type: String,
      default: null,
      trim: true
    },

    telegramId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
