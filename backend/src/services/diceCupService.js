const DiceCupGame = require("../models/DiceCupGame");

const {
  placeBet,
  addWinnings
} = require("./betService");

async function playDiceCup(
  entryId,
  betAmount,
  choice
) {

  // ========================================
  // VALIDATE CHOICE
  // ========================================

  if (![1, 2].includes(Number(choice))) {
    throw new Error(
      "Choice must be cup 1 or cup 2"
    );
  }

  const selectedCup = Number(choice);


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

  const diceCup =
    Math.random() < 0.5 ? 1 : 2;

  const won =
    selectedCup === diceCup;


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
    await DiceCupGame.create({

      entry: entryId,

      betAmount,

      selectedCup,

      diceCup,

      won,

      winnings,

      status: "completed"
    });


  // ========================================
  // RETURN RESULT
  // ========================================

  return {

    success: true,

    game: "dice_cup",

    gameId:
      game._id,

    selectedCup,

    diceCup,

    won,

    betAmount,

    winnings,

    demoBalance,

    targetResult
  };
}


module.exports = {
  playDiceCup
};
