const {
  createDeposit,
  getDeposit
} = require("../services/depositService");

const {
  verifyDeposit
} = require("../services/depositVerificationService");


// ==========================================
// CREATE DEPOSIT
// ==========================================

async function createDepositController(req, res) {
  try {

    const {
      userId,
      tournamentId,
      amount,
      currency
    } = req.body;


    const result =
      await createDeposit({
        userId,
        tournamentId,
        amount,
        currency
      });


    return res.status(201).json(
      result
    );

  } catch (error) {

    console.error(
      "Create deposit error:",
      error.message
    );


    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


// ==========================================
// GET DEPOSIT
// ==========================================

async function getDepositController(req, res) {
  try {

    const {
      id
    } = req.params;


    const deposit =
      await getDeposit(id);


    return res.json({
      success: true,
      deposit
    });


  } catch (error) {

    return res.status(404).json({
      success: false,
      error: error.message
    });
  }
}


// ==========================================
// VERIFY CONFIRMED DEPOSIT
// ==========================================

async function verifyDepositController(req, res) {
  try {

    const {
      depositId,
      userId,
      tournamentId,
      amount
    } = req.body;


    const result =
      await verifyDeposit({
        depositId,
        userId,
        tournamentId,
        amount
      });


    return res.json(
      result
    );


  } catch (error) {

    console.error(
      "Verify deposit error:",
      error.message
    );


    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


// ==========================================
// MARK DEPOSIT USED FOR ENTRY
// ==========================================

async function useDepositForEntryController(req, res) {
  try {

    const {
      depositId
    } = req.body;


    if (!depositId) {
      throw new Error(
        "depositId is required"
      );
    }


    const Deposit =
      require("../models/Deposit");


    const deposit =
      await Deposit.findById(
        depositId
      );


    if (!deposit) {
      throw new Error(
        "Deposit not found"
      );
    }


    if (deposit.usedForEntry) {
      throw new Error(
        "Deposit already used"
      );
    }


    deposit.usedForEntry =
      true;


    await deposit.save();


    return res.json({
      success: true,
      message:
        "Deposit marked as used",
      depositId:
        deposit._id
    });


  } catch (error) {

    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}


// ==========================================
// TEST CONFIRM DEPOSIT
// ==========================================

async function testConfirmDepositController(req, res) {
  try {

    const {
      depositId
    } = req.body;


    if (!depositId) {
      throw new Error(
        "depositId is required"
      );
    }


    const Deposit =
      require("../models/Deposit");


    const deposit =
      await Deposit.findById(
        depositId
      );


    if (!deposit) {
      throw new Error(
        "Deposit not found"
      );
    }


    deposit.status =
      "confirmed";


    deposit.confirmedAt =
      new Date();


    await deposit.save();


    return res.json({
      success: true,
      message:
        "Test deposit confirmed",
      deposit: {
        id:
          deposit._id,

        status:
          deposit.status,

        confirmedAt:
          deposit.confirmedAt
      }
    });


  } catch (error) {

    return res.status(400).json({
      success: false,
      error: error.message
    });

  }
}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createDepositController,
  getDepositController,
  verifyDepositController,
  useDepositForEntryController,
  testConfirmDepositController
};
