const User = require("../model/User");
const bcrypt = require("bcryptjs");

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({
      email: user.email,
      name: user.name,
      bio: user.bio,
      photo: user.photo,
    });
  } catch (err) {
    console.error(err);
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
module.exports = { signup, login, saveProfile };
