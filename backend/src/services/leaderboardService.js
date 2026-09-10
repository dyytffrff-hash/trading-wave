const TournamentEntry = require("../models/TournamentEntry");
const Tournament = require("../models/Tournament");
const User = require("../models/User");

async function getTournamentLeaderboard(tournamentId) {

  const tournament =
    await Tournament.findById(
      tournamentId
    );

  if (!tournament) {
    throw new Error(
      "Tournament not found"
    );
  }

  const entries =
    await TournamentEntry.find({
      tournament: tournamentId,
      status: {
        $in: [
          "active",
          "winner",
          "finished"
        ]
      }
    })
    .sort({
      demoBalance: -1,
      updatedAt: 1
    });


  // ==========================================
  // LOAD USERS
  // ==========================================

  const userIds =
    entries.map(
      entry => entry.user
    );

  const users =
    await User.find({
      _id: {
        $in: userIds
      }
    }).select(
      "username firstName lastName"
    );


  // ==========================================
  // CREATE USER LOOKUP
  // ==========================================

  const userMap =
    new Map(
      users.map(
        user => [
          user._id.toString(),
          user
        ]
      )
    );


  // ==========================================
  // BUILD LEADERBOARD
  // ==========================================

  const leaderboard =
    entries.map(
      (entry, index) => {

        const user =
          userMap.get(
            entry.user.toString()
          );

        return {
          rank:
            index + 1,

          entryId:
            entry._id,

          user: user
            ? {
                username:
                  user.username,

                firstName:
                  user.firstName,

                lastName:
                  user.lastName
              }
            : null,

          demoBalance:
            entry.demoBalance,

          status:
            entry.status
        };
      }
    );


  // ==========================================
  // PUBLIC 50% PRIZE
  // ==========================================

  const totalCollected =
    Number(
      tournament.prizePool || 0
    );

  const publicPrizePool =
    Number(
      (
        totalCollected * 0.50
      ).toFixed(2)
    );


  return {
    success: true,

    tournament: {
      id:
        tournament._id,

      name:
        tournament.name,

      entryFee:
        tournament.entryFee,

      playerCount:
        tournament.playerCount,

      prizePool:
        publicPrizePool,

      winnerCount:
        tournament.winnerCount,

      status:
        tournament.status
    },

    leaderboard
  };
}


module.exports = {
  getTournamentLeaderboard
};
