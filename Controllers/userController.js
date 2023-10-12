const mongoose = require("mongoose");

const User = require("../models/userModel");

exports.getUser = (req, res, next) => {
  //get userId from params
  const userId = req.params.userId;
  
  User.findById(userId)
    .populate("budgetList")
    .then((foundUser) => {
      if (!foundUser) {
        res
          .status(404)
          .json({ message: "Error! El usuario no existe", userId: userId });
      }
      
      res.status(200).json({
        message: "Usuario encontrado",
        user: foundUser,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Error interno del servidor";
      }
      next(err);
    });
};
