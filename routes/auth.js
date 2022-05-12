const express = require('express');
const router = express.Router();

const authController = require("../controller/auth");

// Post Sign UP
router.put("/signup", authController.postSignUp);

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

module.exports = router;