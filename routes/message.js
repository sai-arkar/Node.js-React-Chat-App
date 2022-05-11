const express = require("express");
const router = express.Router();

const messageControllers = require("../controller/message");

router.post("/send", messageControllers.postMessage);

router.get("/msg/:rId", messageControllers.getMessages);

router.delete("/delete", messageControllers.deleteMessage);

module.exports = router;