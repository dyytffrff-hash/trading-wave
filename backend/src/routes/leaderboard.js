const express = require("express");

const {
  getTournamentLeaderboard
} = require("../services/leaderboardService");

const router = express.Router();


// ==========================================
// GET TOURNAMENT LEADERBOARD
// ==========================================

router.get(
  "/:tournamentId",
  async (req, res) => {
    try {
      const result =
        await getTournamentLeaderboard(
          req.params.tournamentId
        );

      res.json(result);

    } catch (error) {
      console.error(
        "Could not load leaderboard:",
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
