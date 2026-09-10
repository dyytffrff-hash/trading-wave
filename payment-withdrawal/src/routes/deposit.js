const express = require("express");

const {
  createDepositController,
  getDepositController,
  verifyDepositController,
  useDepositForEntryController,
  testConfirmDepositController
} = require("../controllers/depositController");

const mainBackendAuth =
  require("../middleware/mainBackendAuth");

const router = express.Router();


// ==========================================
// CREATE DEPOSIT
// ==========================================
//
// POST /api/deposit/create
//

router.post(
  "/create",
  createDepositController
);


// ==========================================
// VERIFY CONFIRMED DEPOSIT
// ==========================================
//
// POST /api/deposit/verify
//
// Only the main Trading Wave backend
// can use this endpoint.
//

router.post(
  "/verify",
  mainBackendAuth,
  verifyDepositController
);


// ==========================================
// MARK DEPOSIT USED FOR ENTRY
// ==========================================
//
// POST /api/deposit/use-for-entry
//
// Only the main Trading Wave backend
// can use this endpoint.
//

router.post(
  "/use-for-entry",
  mainBackendAuth,
  useDepositForEntryController
);


// ==========================================
// TEST CONFIRM DEPOSIT
// ==========================================
//
// POST /api/deposit/test-confirm
//
// TESTING ONLY.
//

router.post(
  "/test-confirm",
  testConfirmDepositController
);


// ==========================================
// GET DEPOSIT
// ==========================================
//
// GET /api/deposit/:id
//

router.get(
  "/:id",
  getDepositController
);


module.exports = router;
