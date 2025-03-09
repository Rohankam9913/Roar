const Chat = require("../models/chats.models");

const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    const _id = req.user.userId;

    const isChatExists = await Chat.find({
      isGroupChat: false,
      $and: [
        { members: { $elemMatch: { $eq: _id } } },
        { members: { $elemMatch: { $eq: userId } } }
      ]
    }).populate("members", "_id username email");

    if (isChatExists.length > 0) {
      return res.status(200).json(isChatExists);
    }

    let chatObject = {
      chatName: "temp",
      members: [_id, userId]
    }

    new_chat = await Chat.create(chatObject);
    new_chat = await Chat.findById({ _id: new_chat._id })
      .populate("members", "_id username email");

    return res.status(201).json(new_chat);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while creating chat" });
  }
}

const fetchAllChats = async (req, res) => {
  try {

    const _id = req.user.userId;

    let allChats = await Chat.find({ members: { $in: { _id } } })
      .populate("members", "_id username")
      .populate("latestMessage")
      .sort("-createdAt");

    if (allChats.length === 0) {
      return res.status(200).json({ msg: "No chats found" });
    }

    return res.status(200).json(allChats);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while fetching all chats" });
  }
}

const createGroup = async (req, res) => {
  try {
    const { members, chatName } = req.body;

    const _id = req.user.userId;

    let users = [...members];
    users.push(_id);

    if (users.length < 3) {
      return res.status(400).json({ error: "You cannot form group which consists less than 3 members" });
    }

    const isGroupExists = await Chat.findOne({ chatName: chatName });
    if (isGroupExists) {
      return res.status(400).json({ error: "You cannot have two groups with same name" });
    }

    let new_group = await Chat.create({ chatName: chatName, members: users, admin: _id, isGroupChat: true });
    new_group = await Chat.findById({ _id: new_group._id })
      .populate("members", "username _id")
      .populate("admin", "username _id")

    return res.status(201).json(new_group);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while creating group" });
  }
}

const addUser = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    const isUserAlreadyInGroup = await Chat.findOne({ _id: chatId, $and: [{ members: { $in: [userId] } }] });
    if (isUserAlreadyInGroup) {
      return res.status(400).json({ error: "User already in group" });
    }

    const group = await Chat.findByIdAndUpdate({ _id: chatId, isGroupChat: true }, { $push: { members: userId } }, { new: true })
      .populate("members", "username _id")
      .populate("admin", "username _id");

    return res.status(200).json(group);

  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while adding new user" });
  }
}

const removeUser = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    const isUserNotPresent = await Chat.findOne({ _id: chatId, $and: [{ members: { $in: [userId] } }] });

    if (!isUserNotPresent) {
      return res.status(400).json({ error: "User does not exists in the group" });
    }

    const group = await Chat.findByIdAndUpdate({ _id: chatId, isGroupChat: true }, { $pull: { members: userId } }, { new: true })
      .populate("members", "username _id")
      .populate("admin", "username _id");

    return res.status(200).json(group);

  }
  catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "Error happened while removing user from group" });
  }
}

const renameChat = async (req, res) => {
  try {
    const { chatId, newChatName } = req.body;

    if (!newChatName) {
      return res.status(400).json({ error: "Missing Details" });
    }

    const isChatExists = await Chat.findById({ _id: chatId });
    if (!isChatExists) {
      return res.status(400).json({ error: "Chat does not exists" });
    }

    const updateGroup = await Chat.findByIdAndUpdate({ _id: chatId }, { chatName: newChatName }, { new: true })
      .populate("members", "username _id")
      .populate("admin", "username _id");

    return res.status(200).json(updateGroup);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while renaming chat" });
  }
}

const blockChat = (req, res) => {
  try {

  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while blocking chat" });
  }
}

const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const groupDetails = await Chat.findOne({ _id: groupId })
    .populate("members", "_id username")
    .populate("admin", "_id username");

    if (!groupDetails) {
      return res.status(400).json({ error: "No Details found" });
    }

    return res.status(200).json(groupDetails);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while getting the details about group" });
  }
}

module.exports = { createChat, fetchAllChats, createGroup, addUser, removeUser, renameChat, blockChat, getGroupDetails };