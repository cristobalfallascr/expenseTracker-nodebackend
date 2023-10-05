const mongoose = require("mongoose");
const expenses = [];
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator"); // reads the validation result as configured in the Routes

const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");
const Transaction = require("../models/transactionModel");

exports.getBudget = (req, res, next) => {
  const budgetCode = req.params.budgetCode.toLowerCase();

  Budget.findOne({ budgetCode: budgetCode })
    .populate("expenseList")
    .then((foundBudget) => {
      if (!foundBudget) {
        res.status(404).json({
          message: "No pudimos encontrar un presupesto con tu código...",
          searchCode: budgetCode,
        });
      } else {
        const token = jwt.sign(
          {
            budget: foundBudget.budgetCode,
          },
          process.env.SESSION_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "Budget retrieved successfully!",
          budget: foundBudget,
          token: token,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // Budget.findById(req.budget._id)
  //   .populate("expenseList")
  //   .then((budget) => {
  //     console.log(budget);
  //     res.status(200).json({ message: "sucess", budget: budget });
  //   });
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

  const getBudgetCode = () => {
    let budgetCodeString = "";
    const trimmedTitle = req.body.title.trim();

    const wordArray = trimmedTitle.split(" ");

    wordArray.map((word) => {
      let newString = word.substring(0, 2);
      result = budgetCodeString.concat(newString);
      budgetCodeString = result.toLowerCase();
    });
    return budgetCodeString;
  };

  const title = req.body.title;
  const budgetCode = getBudgetCode();
  const type = req.body.type;
  const description = req.body.description;
  const budgetTotalAmount = req.body.budgetTotalAmount;
  const budgetOwners = {};
  const expenseList = [];
  const createdDate = new Date().toLocaleDateString("es-Es");
  const budgetAmountUsed = 0;
  const expenseCount = 0;
  const budgetAmountAssigned = 0;
  const budgetAmountUnassigned = req.body.budgetTotalAmount;
  const budgetAmountAvailable = budgetTotalAmount - budgetAmountUsed;
  //Create budget in db
  const budget = new Budget({
    title: title,
    description: description,
    budgetCode: budgetCode,
    budgetTotalAmount: budgetTotalAmount,
    budgetAmountAvailable: budgetAmountAvailable,
    budgetAmountUsed: budgetAmountUsed,
    budgetOwners: budgetOwners,
    expenseList: expenseList,
    expenseCount: 0,
    budgetAmountAssigned: budgetAmountAssigned,
    budgetAmountAvailable: budgetAmountAvailable,
    budgetAmountUnassigned: budgetAmountUnassigned,
    userId: req.user,
  });
  //Attempt saving budget
  budget
    .save()
    .then((result) => {
      res.status(201).json({
        message: "New Budget created successfully",
        date: createdDate,
        budget: result.budgetCode,
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
  const transactions = 0;
  const budgetId = req.body.budgetId;
  const transactionList = [];

  //define new budget amount

  const expense = new Expense({
    title: title,
    type: type,
    description: description,
    budgetedAmount: budgetedAmount,
    usedAmount: usedAmount,
    availableAmount: availableAmount,
    transactions: transactions,
    budgetId: budgetId,
    transactionList: transactionList,

    userId: req.user,
  });

  expense.save().then((result) => {
    const expenseId = result._id;
    const budget = result.budgetId._id;
    Budget.findById(budget).then((foundBudget) => {
      const newExpenseCount = foundBudget.expenseCount + 1;
      const newBudgetAmountAssigned =
        foundBudget.budgetAmountAssigned + parseInt(budgetedAmount);
      const newBudgetAmountUnassigned =
        foundBudget.budgetTotalAmount - budgetedAmount;

      Budget.updateOne(
        { _id: budget._id },
        {
          $push: { expenseList: expenseId },
          expenseCount: newExpenseCount,
          budgetAmountAssigned: newBudgetAmountAssigned,
          budgetAmountUnassigned: newBudgetAmountUnassigned,
        }
      )
        .then((updateResult) => {
          res.status(201).json({
            message: "Expense created successfully",
            expense: updateResult,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};

// Update Budget amounts when adding transactions

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

  const title = req.body.title;
  const type = req.body.type;
  const description = req.body.description;
  const usedAmount = req.body.usedAmount;
  const expenseId = req.body.expenseId;
  const userId = req.user;
  const record = 1;

  const transaction = new Transaction({
    title: title,
    type: type,
    description: description,
    usedAmount: usedAmount,
    expenseId: expenseId,
    userId: req.user,
  });

  transaction.save().then((result) => {
    const transactionId = result._id;
    const expenseId = result.expenseId._id;

    Expense.findById(expenseId).then((foundExpense) => {
      const newTransactionCount = foundExpense.transactions + 1;
      const newUsedAmount = foundExpense.usedAmount + parseInt(usedAmount);
      const newAvailableAmount =
        foundExpense.availableAmount - parseInt(usedAmount);

      Expense.updateOne(
        { _id: expenseId },
        {
          $push: { transactionList: transactionId },
          transactions: newTransactionCount,
          usedAmount: newUsedAmount,
          availableAmount: newAvailableAmount,
        }
      ).then((updateResult) => {
        Budget.findById(foundExpense.budgetId).then((foundBudget) => {
          const newBudgetAmountUsed =
            foundBudget.budgetAmountUsed + newUsedAmount;
          const newBudgetAmountAvailable =
            foundBudget.budgetAmountAvailable - newUsedAmount;

          Budget.updateOne(
            { _id: foundBudget._id },
            {
              budgetAmountUsed: newBudgetAmountUsed,
              budgetAmountAvailable: newBudgetAmountAvailable,
            }
          )
            .then((updateResult) => {
              res.status(201).json({
                message: "Transacción agregada",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    });
  });
};
