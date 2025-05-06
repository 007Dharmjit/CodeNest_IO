const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: String,
  friendID: String,
  roomId: String, 
  user: String,
  userImage: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
