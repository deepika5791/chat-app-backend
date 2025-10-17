const express = require("express");
const router = express.Router();
const {
  getMessages,
  uploadImage,
  deleteMessage,
  updateProfile,
  saveMessage,
} = require("../useController/chatController");

router.post("/", saveMessage);
router.get("/", getMessages);
router.post("/upload-image", uploadImage);
router.delete("/:id", deleteMessage);
router.put("/profile", updateProfile);

module.exports = router;
