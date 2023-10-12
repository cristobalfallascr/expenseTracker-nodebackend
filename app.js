const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
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
const CON_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SEC}@cluster0.1wlk1.mongodb.net/${process.env.DBNAME}?`;
const store = new mongodbStore({
  uri: CON_URI,
  collection: "sessions",
});

//Define routes
const authRoutes = require("./routes/auth");
const budgetRoutes = require("./routes/budget");
const userRoutes = require("./routes/user");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json()); // to parse application/json

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
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/budgets", budgetRoutes);

///Error routes
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
  next();
});

// app.use((req, res, next) => {
//   res.status(404).json({ message: "Page not found!" });
// });

mongoose
  .connect(CON_URI)
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
