const express = require("express");
const { body } = require("express-validator");

const User = require("../models/userModel");

const authControler = require("../Controllers/authController");

const router = express.Router();

/////////////////////////GET Routes

/////////////////////////POST Routes

//Create a POST route for user signup
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("name")
      .trim()
      .isLength({ min: 3 })
      .not()
      .isEmpty()
      .withMessage("Name is required"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  authControler.signup
);

//Create a POST route for user login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")

      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  authControler.login
);

module.exports = router;
