const expenses = [];

const { validationResult } = require("express-validator"); // reads the validation result as configured in the Routes

const Budget = require("../models/budgetModel");

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

//Post expenses

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
