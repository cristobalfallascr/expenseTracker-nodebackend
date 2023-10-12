const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const router = express.Router();

const userController = require("../Controllers/userController");

//////////////////GET Routes

//#1. Get user
router.get("/:userId", isAuth, userController.getUser);

module.exports = router;
