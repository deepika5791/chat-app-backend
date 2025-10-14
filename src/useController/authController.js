const User = require("../model/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err); // <--- Log the error
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    res.json({
      email: user.email,
      name: user.name,
      bio: user.bio,
      photo: user.photo,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const saveProfile = async (req, res) => {
  try {
    const { email, bio } = req.body;
    const user = await User.findOneAndUpdate({ email }, { bio }, { new: true });
    res.json({ email: user.email, bio: user.bio });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { signup , login , saveProfile};