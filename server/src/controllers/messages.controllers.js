const Message = require("../models/messages.models");
const Chat = require("../models/chats.models");
const { Types } = require("mongoose");

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    const _id = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: "Message is not provided" });
    }

    let new_message = await Message.create({ sender: _id, content: content, chat: chatId });
    await Chat.findByIdAndUpdate({ _id: chatId }, { latestMessage: new_message._id }, { new: true });

    new_message = await Message.findById({ _id: new_message._id })
      .populate("sender", "username _id")
      .populate("chat");

    return res.status(200).json(new_message);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while sending message" });
  }
}

const fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const objectId = Types.ObjectId;
    if (!objectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const allMessages = await Message.find({ chat: chatId })
      .populate("sender", "username _id")
      .populate("chat");

    if (allMessages.length === 0) {
      return res.status(200).json({ error: "No Messags Found" });
    }

    return res.status(200).json(allMessages);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while fetching messages" });
  }
}

module.exports = { sendMessage, fetchMessages };

