const Chat = require("../models/chats.models");

const makeAnotherUserAdmin = (chatDetails, userId) => {
  let members = chatDetails.members;
  
  members = members.filter((member) => member.toString() !== userId);
  return members[0].toString();
}

const removeUserMiddleware = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    let chatDetails = await Chat.findById({ _id: chatId });

    if (chatDetails.admin.toString() === userId) {
      let new_admin = makeAnotherUserAdmin(chatDetails, userId);
      chatDetails = await Chat.findByIdAndUpdate({ _id: chatId }, { admin: new_admin }, { new: true });
      return next();
    }

    if (chatDetails.admin.toString() === req.user.userId || req.user.userId === userId) {
      return next();
    }

    return res.status(401).json({ error: "Only admins are allowed to perform this task" });
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Something went wrong" })
  }
}

const addUserMiddleware = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const chatDetails = await Chat.findById({ _id: chatId });

    if (chatDetails.admin.toString() === req.user.userId) {
      return next();
    }

    return res.status(401).json({ error: "Only admins are allowed to perform this task" });
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { removeUserMiddleware, addUserMiddleware };
