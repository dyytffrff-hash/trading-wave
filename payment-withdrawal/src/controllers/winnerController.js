const {
  registerWinner
} = require("../services/winnerService");


async function registerWinnerController(
  req,
  res
) {
  try {

    const {
      userId,
      tournamentId,
      prizeAmount,
      rank,
      winnerCount,
      telegramId
    } = req.body;


    const result =
      await registerWinner({
        userId,
        tournamentId,
        prizeAmount,
        rank,
        winnerCount,
        telegramId
      });


    return res.status(201).json(
      result
    );

  } catch (error) {

    console.error(
      "Winner registration error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


module.exports = {
  registerWinnerController
};
