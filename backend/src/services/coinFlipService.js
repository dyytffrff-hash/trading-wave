const CoinFlipGame = require("../models/CoinFlipGame");

const {
  placeBet,
  addWinnings
} = require("./betService");

async function playCoinFlip(
  entryId,
  betAmount,
  choice
) {

  // ========================================
  // VALIDATE CHOICE
  // ========================================

  if (
    !["heads", "tails"].includes(choice)
  ) {
    throw new Error(
      "Choice must be heads or tails"
    );
  }


  // ========================================
  // PLACE BET
  // ========================================

  const bet = await placeBet(
    entryId,
    betAmount
  );


  // ========================================
  // GENERATE RESULT
  // ========================================

  const result =
    Math.random() < 0.5
      ? "heads"
      : "tails";


  const won =
    choice === result;


  let winnings = 0;
  let demoBalance = bet.demoBalance;
  let targetResult = null;


  // ========================================
  // WIN
  // ========================================

  if (won) {

    // 2x total payout
    winnings =
      Number(
        (betAmount * 2).toFixed(2)
      );


    const resultData =
      await addWinnings(
        entryId,
        winnings
      );


    demoBalance =
      resultData.demoBalance;

    targetResult =
      resultData.targetResult;
  }


  // ========================================
  // SAVE GAME
  // ========================================

  const game =
    await CoinFlipGame.create({

      entry: entryId,

      betAmount,

      choice,

      result,

      won,

      winnings,

      status: "completed"
    });


  // ========================================
  // RETURN RESULT
  // ========================================

  return {

    success: true,

    game: "coin_flip",

    gameId:
      game._id,

    choice,

    result,

    won,

    betAmount,

    winnings,

    demoBalance,

    targetResult
  };
}


module.exports = {
  playCoinFlip
};
