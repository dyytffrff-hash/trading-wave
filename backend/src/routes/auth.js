const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      firstName,
      lastName
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters"
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists"
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const user =
      await User.create({
        email: normalizedEmail,
        passwordHash,
        username: username || null,
        firstName: firstName || null,
        lastName: lastName || null
      });

    const token =
      jwt.sign(
        {
          userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Unable to create account"
    });
  }
});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const user =
      await User.findOne({
        email:
          String(email).trim().toLowerCase()
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    const passwordValid =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    const token =
      jwt.sign(
        {
          userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Unable to login"
    });
  }
});


module.exports = router;
