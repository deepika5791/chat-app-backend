const express = require("express");
const router = express.Router();
const {
  getMessages,
  uploadImage,
  updateProfile,
  saveMessage,
  deleteMessage,
} = require("../useController/chatController");

router.delete("/:id/:sender", deleteMessage);
router.post("/", saveMessage);
router.get("/", getMessages);
router.post("/upload-image", uploadImage);
router.put("/profile", updateProfile);

module.exports = router;
