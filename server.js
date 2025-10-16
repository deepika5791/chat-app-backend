require("dotenv").config(); // <-- MUST be at the top

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const Message = require("./src/model/Message");
const User = require("./src/model/User");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-application-eight-brown.vercel.app/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

let onlineUsers = [];
let userSockets = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userOnline", (name) => {
    userSockets[name] = socket.id;
    if (!onlineUsers.includes(name)) onlineUsers.push(name);
    io.emit("updateOnlineUsers", onlineUsers);
  });
  socket.on("sendMessage", async (msg) => {
    try {
      // Save to MongoDB
      const newMsg = new Message({
        sender: msg.sender,
        receiver: msg.receiver,
        message: msg.message,
        createdAt: msg.createdAt || new Date(),
      });
      const savedMsg = await newMsg.save();

      // Broadcast to all clients
      io.emit("receiveMessage", savedMsg);
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });
  // socket.on("sendMessage", (msg) => io.emit("receiveMessage", msg));

  socket.on("deleteMessage", ({ id }) => io.emit("messageDeleted", { id }));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let name in userSockets) {
      if (userSockets[name] === socket.id) {
        delete userSockets[name];
        onlineUsers = onlineUsers.filter((u) => u !== name);
        io.emit("updateOnlineUsers", onlineUsers);
        break;
      }
    }
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
