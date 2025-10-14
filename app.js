const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/userRoutes/authRoutes");
const chatRoutes = require("./src/userRoutes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
