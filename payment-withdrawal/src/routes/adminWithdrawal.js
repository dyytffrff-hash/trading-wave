const express = require("express");

const adminAuth =
  require("../middleware/adminAuth");

const {
  getWithdrawals,
  startWithdrawalProcessing,
  completeWithdrawalPayout,
  failWithdrawalPayout
} = require("../controllers/adminWithdrawalController");

const router = express.Router();


// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

router.use(adminAuth);


// ==========================================
// GET ALL WITHDRAWALS
// ==========================================

router.get(
  "/withdrawals",
  getWithdrawals
);


// ==========================================
// START PAYOUT
// pending → processing
// ==========================================

router.patch(
  "/withdrawals/:id/process",
  startWithdrawalProcessing
);


// ==========================================
// COMPLETE PAYOUT
// processing → completed
// ==========================================

router.patch(
  "/withdrawals/:id/payout-complete",
  completeWithdrawalPayout
);


// ==========================================
// FAIL PAYOUT
// processing → failed
// ==========================================

router.patch(
  "/withdrawals/:id/payout-failed",
  failWithdrawalPayout
);


module.exports = router;
