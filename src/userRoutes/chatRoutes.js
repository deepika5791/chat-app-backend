const express = require("express");
const router = express.Router();
const {
  getMessages,
  uploadImage,
  updateProfile,
  saveMessage,
  deleteMessage,
} = require("../useController/chatController");

router.delete("/:id", deleteMessage); // add this
router.post("/", saveMessage);
router.get("/", getMessages);
router.post("/upload-image", uploadImage);
router.put("/profile", updateProfile);

module.exports = router;
