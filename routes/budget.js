const express = require("express");
const { body } = require("express-validator"); // using body method from express validator

const budgetsController = require("../Controllers/budgets");
const expenseData = require("../ZZZZ_Archive/expenses");

const router = express.Router();

//////// GET ROUTES
//GET /budgets/my-budgets
// router.get("/my-budget", budgetsController.getBudget);
router.get("/my-budget/:budgetCode", budgetsController.getBudget);
//GET /budgets/add-expense
router.get("/add-expense", budgetsController.getAddExpense);

//////// POST ROUTES
//POST /budgets/create-budget
router.post(
  "/create-budget",
  [
    body("title").trim().isLength({ min: 5 }),
    body("budgetTotalAmount").notEmpty().isInt(),
  ],
  budgetsController.postCreateBudget
);

//POST /budget/add-expense
router.post(
  "/add-expense",
  [
    body("title").trim().isLength({ min: 5 }),
    body("budgetedAmount").notEmpty().isInt(),
    // body("usedAmout").notEmpty().isInt(),
    // body("availableAmount").notEmpty().isInt(),
  ],
  budgetsController.postAddExpense
);

//POST /budget/add-transacton
router.post(
  "/add-transaction",
  [body("usedAmount").notEmpty().isInt()],
  budgetsController.postAddTransation
);

module.exports = router;
