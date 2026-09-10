const express = require("express");

const {
  registerWinnerController
} = require("../controllers/winnerController");

const mainBackendAuth =
  require("../middleware/mainBackendAuth");

const router = express.Router();


// ==========================================
// REGISTER VERIFIED WINNER
// ==========================================
//
// Only the main Trading Wave backend can
// register a winner.
//
// POST /api/winner/register
//
// Required header:
// x-main-backend-key: <private API key>
//

router.post(
  "/register",
  mainBackendAuth,
  registerWinnerController
);


module.exports = router;
