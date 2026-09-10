const express = require("express");

const {
  playCoinFlip
} = require("../services/coinFlipService");

const {
  playDiceCup
} = require("../services/diceCupService");

const {
  startDragonNet,
  chooseHole,
  cashOut: dragonCashOut
} = require("../services/dragonNetService");

const {
  startCrash,
  updateMultiplier,
  cashOut: crashCashOut
} = require("../services/crashService");

const router = express.Router();


// ===============================
// COIN FLIP
// ===============================

router.post("/coin-flip", async (req, res) => {
  try {
    const {
      entryId,
      betAmount,
      choice
    } = req.body;

    const result = await playCoinFlip(
      entryId,
      Number(betAmount),
      String(choice).toLowerCase()
    );

    res.json(result);

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});


// ===============================
// DICE CUP
// ===============================

router.post("/dice-cup", async (req, res) => {
  try {
    const {
      entryId,
      betAmount,
      choice
    } = req.body;

    const result = await playDiceCup(
      entryId,
      Number(betAmount),
      Number(choice)
    );

    res.json(result);

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});


// ===============================
// DRAGON NET - START
// ===============================

router.post(
  "/dragon-net/start",
  async (req, res) => {
    try {
      const {
        entryId,
        betAmount
      } = req.body;

      const result =
        await startDragonNet(
          entryId,
          Number(betAmount)
        );

      res.json(result);

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


// ===============================
// DRAGON NET - CHOOSE HOLE
// ===============================

router.post(
  "/dragon-net/choose",
  async (req, res) => {
    try {
      const {
        gameId,
        hole
      } = req.body;

      const result =
        await chooseHole(
          gameId,
          Number(hole)
        );

      res.json(result);

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


// ===============================
// DRAGON NET - CASH OUT
// ===============================

router.post(
  "/dragon-net/cashout",
  async (req, res) => {
    try {
      const {
        gameId
      } = req.body;

      const result =
        await dragonCashOut(
          gameId
        );

      res.json(result);

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


// ===============================
// CRASH - START
// ===============================

router.post(
  "/crash/start",
  async (req, res) => {
    try {
      const {
        entryId,
        betAmount
      } = req.body;

      const result =
        await startCrash(
          entryId,
          Number(betAmount)
        );

      /*
       * startCrash deliberately does NOT
       * return the hidden crash point.
       */

      res.json(result);

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


// ===============================
// CRASH - UPDATE MULTIPLIER
// ===============================

router.post(
  "/crash/update",
  async (req, res) => {
    try {
      const {
        gameId,
        multiplier
      } = req.body;

      const result =
        await updateMultiplier(
          gameId,
          Number(multiplier)
        );

      res.json(result);

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


// ===============================
// CRASH - CASH OUT
// ===============================

router.post(
  "/crash/cashout",
  async (req, res) => {
    try {
      const {
        gameId
      } = req.body;

      const result =
        await crashCashOut(
          gameId
        );

      res.json(result);

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


module.exports = router;
