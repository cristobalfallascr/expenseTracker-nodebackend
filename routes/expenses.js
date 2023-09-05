const exp = require('constants');
const express = require('express');
const path = require('path')
const budgetsController = require('../Controllers/budgets')

const router = express.Router()

const expenses = [];

router.use("/add-expense", budgetsController.getAddExpense);
  
  router.post("/expense", (req, res, next) => {
    expenses.push({'title': req.body.title})
    
    res.redirect("/budget");
  });


  
  exports.routes= router;
  exports.expenses =expenses;
  