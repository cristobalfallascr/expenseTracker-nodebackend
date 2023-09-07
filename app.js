const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/userModel");
const Budget = require("./models/budgetModel");
const Expense = require("./models/expenseModel");

const app = express();
const connectURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SEC}@cluster0.1wlk1.mongodb.net/budgetAppDB?retryWrites=true&w=majority`;

//No need to set view engine as we will work with REST APIs
//app.set('view engine', 'ejs');
//app.set('views', 'views');


const budgetRoutes = require("./routes/budget");

//No need for parsing URL encoded
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json()); // to parse application/json

//to save a user in the request
app.use((req, res, next) => {
  User.findById("64f79b91c5a80d4a22171518")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// to save a budget in request
app.use((req, res, next) => {
  Budget.findById("64f61b353635dbea7a8acabc")
    .then((budget) => {
      console.log(budget);
      req.budget = budget;
      next();
    })
    .catch((err) => console.log(err));
});

// to save a expense in request
app.use((req, res, next) => {
  Expense.findById("64fa3c76f785157f3bd3d2a1")
    .then((expense) => {
      console.log(expense);
      req.expense = expense;
      next();
    })
    .catch((err) => console.log(err));
});

// To enable CORS operations
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methdos",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use("/budgets", budgetRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

mongoose
  .connect(connectURI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Cris Fallas",
          email: "cris@test.com",
          budgets: {
            items: [],
          },
        });

        user
          .save()
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    app.listen(8080);
    console.log("Server running with DB Connection");
  })
  .catch((err) => {
    console.log(err);
  });
