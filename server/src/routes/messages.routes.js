const { Router } = require("express");
const { sendMessage, fetchMessages } = require("../controllers/messages.controllers");
const authMiddleware = require("../middlewares/authMiddleware");

const messageRouter = Router();

// Route for sending message
messageRouter.route("/send_message").post(authMiddleware ,sendMessage);

// Route for getting messages
messageRouter.route("/fetch_messages/:chatId").get(authMiddleware,fetchMessages);

module.exports = messageRouter;