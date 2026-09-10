const express = require("express");
const Tournament = require("../models/Tournament");

const router = express.Router();


// ==========================================
// GET AVAILABLE TOURNAMENTS
// ==========================================
// Only waiting and active tournaments are
// shown publicly.
//
// The public prize pool is 50% of the total
// entry money collected.
//
// Example:
// 100 players × $2 = $200 collected
// Platform = $100
// Winner prize = $100
// ==========================================

router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find({
      status: {
        $in: ["waiting", "active"]
      }
    }).sort({
      createdAt: -1
    });

    const publicTournaments =
      tournaments.map((tournament) => {

        const totalCollected =
          Number(tournament.prizePool || 0);

        const platformShare =
          Number(
            (totalCollected * 0.50).toFixed(2)
          );

        const publicPrizePool =
          Number(
            (totalCollected * 0.50).toFixed(2)
          );

        return {
          ...tournament.toObject(),

          // Amount displayed to players
          prizePool: publicPrizePool,

          // Platform's 50% share
          platformShare
        };
      });

    res.json({
      success: true,
      tournaments: publicTournaments
    });

  } catch (error) {
    console.error(
      "Could not load tournaments:",
      error.message
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// ==========================================
// GET ONE TOURNAMENT
// ==========================================

router.get(
  "/:tournamentId",
  async (req, res) => {

    try {

      const tournament =
        await Tournament.findById(
          req.params.tournamentId
        );

      if (!tournament) {
        return res.status(404).json({
          success: false,
          error: "Tournament not found"
        });
      }

      const totalCollected =
        Number(
          tournament.prizePool || 0
        );

      const platformShare =
        Number(
          (totalCollected * 0.50).toFixed(2)
        );

      const publicPrizePool =
        Number(
          (totalCollected * 0.50).toFixed(2)
        );

      res.json({
        success: true,

        tournament: {
          ...tournament.toObject(),

          // Only 50% is shown as the prize
          prizePool: publicPrizePool,

          // Platform's 50%
          platformShare
        }
      });

    } catch (error) {

      console.error(
        "Could not load tournament:",
        error.message
      );

      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);


module.exports = router;
