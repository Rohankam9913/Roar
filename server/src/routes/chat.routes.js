const { Router } = require("express");
const { createChat, fetchAllChats, createGroup, addUser, removeUser, renameChat, blockChat, getGroupDetails } = require("../controllers/chats.controllers");
const { removeUserMiddleware, addUserMiddleware } = require("../middlewares/groupMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const chatRouter = Router();

// Route for creating one on one chat and also fetching the chat if it already exists
chatRouter.route("/create_chat").post(authMiddleware, createChat);

// Route for fetching all chats for a user
chatRouter.route("/fetch_chats").get(authMiddleware, fetchAllChats);

// Route for creating a new group chat
chatRouter.route("/create_group").post(authMiddleware, createGroup);

// Route for adding user to a group
chatRouter.route("/add_user").put(authMiddleware ,addUserMiddleware, addUser);

// Route for removing user from a group
chatRouter.route("/remove_user").delete(authMiddleware ,removeUserMiddleware, removeUser);

// Route for renaming the chat
chatRouter.route("/rename_chat").put(authMiddleware ,renameChat);

// Route for blocking the chat
chatRouter.route("/block_chat").post(blockChat);

// Routes for getting the group details
chatRouter.route("/get_group_details/:groupId").get(authMiddleware, getGroupDetails);

module.exports = chatRouter;
