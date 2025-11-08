const express = require("express");
const router = express.Router();
const {
  getMessages,
  uploadImage,
  updateProfile,
  saveMessage,
  deleteMessage,
} = require("../useController/chatController");

router.get("/uptime", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.post("/", saveMessage);
router.get("/", getMessages);
router.post("/upload-image", uploadImage);
router.put("/profile", updateProfile);
router.delete("/:id", deleteMessage);
module.exports = router;
