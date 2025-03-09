const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  content: {
    type: String,
    required: true
  },

  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat"
  }
}, { timestamps: true });

const Message = model("Message", messageSchema);
module.exports = Message;