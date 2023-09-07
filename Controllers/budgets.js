const expenses = [];

const { validationResult } = require("express-validator"); // reads the validation result as configured in the Routes

const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");
const Transaction = require("../models/transactionModel");

exports.getBudget = (req, res, next) => {
  res.status(200).json({
    _id: 12345,
    title: "2023 Budget",
    description: "This is the budget",
    expenseCount: 13,
    budgetTotalAmount: 2000,
    budgetAmountUsed: 1300,
    budgetAmountAvailable: 700,
    expenseList: {
      title: "Abarrotes",
      description: "compras en supermercado",
      registros: 3,
      budgetedAmount: 450,
      budgetedAmountUsed: 300,
      budgetedAmountAvailable: 100,
    },
  });
};

exports.getAddExpense = (req, res, next) => {
  res.render("add-expense", {
    expenses: expenses,
    pageTitle: "Registros",
    path: "/budget/add-expense",
    hasExpenses: expenses.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

//POST  Create Budget
exports.postCreateBudget = (req, res, next) => {
  //Validation of input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const title = req.body.title;
  const type = req.body.type;
  const description = req.body.description;
  const budgetTotalAmount = req.body.budgetTotalAmount;
  const budgetOwners = {};
  const expenseList = {};
  const createdDate = new Date().toLocaleDateString("es-Es");
  const budgetAmountUsed = 0;
  const expenseCount = 0;
  const budgetAmountAvailable = budgetTotalAmount - budgetAmountUsed;
  //Create budget in db
  const budget = new Budget({
    title: title,
    description: description,
    budgetTotalAmount: budgetTotalAmount,
    budgetAmountAvailable: budgetAmountAvailable,
    budgetAmountUsed: budgetAmountUsed,
    budgetOwners: budgetOwners,
    expenseList: expenseList,
    expenseCount: 0,
    userId: req.user,
  });
  //Attempt saving budget
  budget
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully",
        date: createdDate,
        budget: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//POST Add an expense
exports.postAddExpense = (req, res, next) => {
  //Validation of input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const title = req.body.title;
  const budgetedAmount = req.body.budgetedAmount;
  const type = req.body.type;
  const description = req.body.description;
  const usedAmount = 0;
  const availableAmount = budgetedAmount - usedAmount;
  const records = 1;
  const budgetId = {};

  const expense = new Expense({
    title: title,
    type: type,
    description: description,
    budgetedAmount: budgetedAmount,
    usedAmount: usedAmount,
    availableAmount: availableAmount,
    records: records,
    // budgetId: budgetId,
    userId: req.user,
  });

  expense
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Expense created successfully",
        expense: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//POST a transaction on an expense
exports.postAddTransation = (req, res, next) => {
  //Validation of input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const usedAmount = req.body.usedAmount;
  const expenseId = req.body.expenseId;
  const userId = req.body.userId;
  const record = 1;

  const transaction = new Transaction({
    usedAmount: usedAmount,
    expenseId: req.expense,
    userId: req.user,
  });

  transaction
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Transaction created successfully",
        transation: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
