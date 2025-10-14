const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

module.exports = mongoose.model("Message", messageSchema);
