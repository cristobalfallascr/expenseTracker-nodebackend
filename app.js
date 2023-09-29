const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const User = require("./models/userModel");
const Budget = require("./models/budgetModel");
const Expense = require("./models/expenseModel");

const app = express();
const connectURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SEC}@cluster0.1wlk1.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;


const budgetRoutes = require("./routes/budget");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(helmet());
app.use(compression());
app.use(morgan("combined", {stream: accessLogStream}));


app.use(bodyParser.json()); // to parse application/json

//to save a user in the request
app.use((req, res, next) => {
  User.findById("6509a88eebdb6e09dad043b0")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});


// To enable CORS operations
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
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
          .then((result) => {})
          .catch((err) => {
            console.log(err);
          });
      }
    });

    app.listen(process.env.PORT || 8080);
    console.log("Server running with DB Connection");
  })
  .catch((err) => {
    console.log(err);
  });