const express = require("express");

const {
  joinTournament,
  getEntry,
  getUserEntries
} = require("../services/entryService");

const router = express.Router();


// ===============================
// JOIN TOURNAMENT
// ===============================

router.post("/join", async (req, res) => {
  try {
    const {
      userId,
      tournamentId,
      depositId
    } = req.body;

    if (
      !userId ||
      !tournamentId ||
      !depositId
    ) {
      return res.status(400).json({
        success: false,
        error:
          "userId, tournamentId and depositId are required"
      });
    }

    const result =
      await joinTournament(
        userId,
        tournamentId,
        depositId
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
// GET ONE ENTRY
// ===============================

router.get(
  "/:entryId",
  async (req, res) => {
    try {
      const entry =
        await getEntry(
          req.params.entryId
        );

      res.json({
        success: true,
        entry
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
);


// ===============================
// GET USER ENTRIES
// ===============================

router.get(
  "/user/:userId",
  async (req, res) => {
    try {
      const entries =
        await getUserEntries(
          req.params.userId
        );

      res.json({
        success: true,
        entries
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


module.exports = router;
