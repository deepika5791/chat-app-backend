const express = require("express");
const router = express.Router();
const {
  getMessages,
  uploadImage,
  deleteMessage,
} = require("../useController/chatController");

router.get("/", getMessages);
router.post("/upload-image", uploadImage);
router.delete("/:id", deleteMessage);

module.exports = router;
