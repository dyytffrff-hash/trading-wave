const Withdrawal = require("../models/Withdrawal");

const {
  startPayout,
  completePayout,
  failPayout
} = require("../services/payoutService");


// ==========================================
// GET ALL WITHDRAWAL REQUESTS
// ==========================================

async function getWithdrawals(req, res) {

  try {

    const withdrawals =
      await Withdrawal.find()
        .sort({
          createdAt: -1
        });

    return res.json({
      success: true,
      withdrawals
    });

  } catch (error) {

    console.error(
      "Get withdrawals error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
}


// ==========================================
// START PAYOUT PROCESSING
// pending → processing
// ==========================================

async function startWithdrawalProcessing(
  req,
  res
) {

  try {

    const {
      id
    } = req.params;

    const result =
      await startPayout(id);

    return res.json({
      success: true,
      payout: result
    });

  } catch (error) {

    console.error(
      "Start payout error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      error: error.message
    });

  }

}


// ==========================================
// COMPLETE PAYOUT
// processing → completed
// ==========================================

async function completeWithdrawalPayout(
  req,
  res
) {

  try {

    const {
      id
    } = req.params;

    const {
      providerReference
    } = req.body;

    const result =
      await completePayout(
        id,
        providerReference
      );

    return res.json({
      success: true,
      payout: result
    });

  } catch (error) {

    console.error(
      "Complete payout error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      error: error.message
    });

  }

}


// ==========================================
// FAIL PAYOUT
// processing → failed
// ==========================================

async function failWithdrawalPayout(
  req,
  res
) {

  try {

    const {
      id
    } = req.params;

    const {
      adminNote
    } = req.body;

    const result =
      await failPayout(
        id,
        adminNote
      );

    return res.json({
      success: true,
      payout: result
    });

  } catch (error) {

    console.error(
      "Fail payout error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      error: error.message
    });

  }

}


module.exports = {
  getWithdrawals,
  startWithdrawalProcessing,
  completeWithdrawalPayout,
  failWithdrawalPayout
};
