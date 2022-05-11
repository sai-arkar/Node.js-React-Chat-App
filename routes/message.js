const express = require("express");
const router = express.Router();

const messageControllers = require("../controller/message");

router.post("/send", messageControllers.postMessage);

module.exports = router;