const express = require("express");

const {
  requestWithdrawalController
} = require("../controllers/withdrawalController");

const router = express.Router();


// ==========================================
// REQUEST PRIZE WITHDRAWAL
// ==========================================
//
// POST /api/withdrawal/request
//
// The backend verifies:
// - user is a winner
// - winner code is valid
// - code has not been used
// - prize is available
// - withdrawal does not already exist
//

router.post(
  "/request",
  requestWithdrawalController
);


module.exports = router;
