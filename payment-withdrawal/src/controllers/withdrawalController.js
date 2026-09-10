const {
  requestWithdrawal
} = require("../services/withdrawalService");


async function requestWithdrawalController(
  req,
  res
) {
  try {

    const {
      userId,
      winnerCode,
      paymentMethod,
      paymentDetails
    } = req.body;


    const result =
      await requestWithdrawal({
        userId,
        winnerCode,
        paymentMethod,
        paymentDetails
      });


    return res.status(201).json(
      result
    );

  } catch (error) {

    console.error(
      "Withdrawal request error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


module.exports = {
  requestWithdrawalController
};
