const Message = require("../model/Message");
const cloudinary = require("../config/cloudnary");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "chat_images",
    });

    res.json({ url: uploaded.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { requester } = req.body;

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    if (msg.sender.toString() !== requester.toString())
      return res.status(403).json({ error: "Not authorized" });

    await Message.findByIdAndDelete(id);

    const io = req.app.get("io");
    io.emit("messageDeleted", { id });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { getMessages, uploadImage, deleteMessage };
