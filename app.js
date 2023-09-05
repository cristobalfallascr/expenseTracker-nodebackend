const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//No need to set view engine as we will work with REST APIs
//app.set('view engine', 'ejs');
//app.set('views', 'views');

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const expenseRoutes = require("./routes/expenses");
const budgetRoutes = require("./routes/budget");

//No need for parsing URL encoded
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json()); // to parse application/json

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



app.use("/admin", adminData.routes);
app.use("/budgets", budgetRoutes);

app.use((req, res, next) => {
  res.status(404).json({message:"Not found"})
});

mongoose
  .connect(
    "mongodb+srv://bcNdeUsr:EBkOKbB5Qs9UGXjA@cluster0.1wlk1.mongodb.net/budgetAppDB?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
    console.log("Server running with DB Connection");
  })
  .catch((err)=>{
    console.log(err)
  });
