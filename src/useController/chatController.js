const Message = require("../model/Message");
const cloudinary = require("../config/cloudnary");
const User = require("../model/User");
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const saveMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const chat = new Message({ sender, receiver, message });
    await chat.save();

    res.status(201).json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

const updateProfile = async (req, res) => {
  try {
    const { email, name, profilePhoto } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let newPhotoUrl = user.photo;
    if (profilePhoto && profilePhoto.startsWith("data:")) {
      const uploaded = await cloudinary.uploader.upload(profilePhoto, {
        folder: "user_profiles",
      });
      newPhotoUrl = uploaded.secure_url;
    }

    user.name = name || user.name;
    user.photo = newPhotoUrl;
    await user.save();

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        profilePhoto: user.photo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Profile update failed" });
  }
};

const deleteMessage = async (req, res) => {
   try {
     const { id, sender } = req.params;
     const message = await Message.findById(id);
     if (!message)
       return res.status(404).json({ message: "Message not found" });

     if (message.sender !== sender) {
       return res.status(403).json({ message: "Not authorized" });
     }

     await Message.findByIdAndDelete(id);
     res.json({ success: true });
   } catch (err) {
     console.error("Delete error:", err);
     res.status(500).json({ error: err.message });
   }
};

module.exports = {
  getMessages,
  uploadImage,
  updateProfile,
  saveMessage,
  deleteMessage

};
