const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
  chatName: {
    type: String,
    required: true
  },

  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  isGroupChat: {
    type: String,
    default: false
  },

  admin: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message"
  }
}, { timestamps: true });

const Chat = model("Chat", chatSchema);
module.exports = Chat;