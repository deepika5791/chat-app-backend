// require("dotenv").config();

// const http = require("http");
// const app = require("./app");
// const { Server } = require("socket.io");
// const connectDB = require("./src/config/db");
// const Message = require("./src/model/Message");

// connectDB();

// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);

// // --- SOCKET.IO SETUP ---
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://chat-application-eight-brown.vercel.app", // frontend URL
//       "http://localhost:5173", // local dev
//     ],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
//   allowEIO3: true, // important for WSS
//   transports: ["websocket", "polling"],
// });

// app.set("io", io);

// let onlineUsers = [];
// let userSockets = {};

// io.on("connection", (socket) => {
//   console.log("🌐 Socket connected:", socket.id);

//   socket.on("userOnline", (name) => {
//     userSockets[name] = socket.id;
//     if (!onlineUsers.includes(name)) onlineUsers.push(name);
//     io.emit("updateOnlineUsers", onlineUsers);
//   });

//   socket.on("sendMessage", async (msg) => {
//     console.log("📩 Received message:", msg);

//     if (!msg.sender || !msg.receiver || !msg.message) {
//       console.error("⚠️ Missing required fields:", msg);
//       return;
//     }

//     try {
//       const newMsg = new Message({
//         sender: msg.sender,
//         receiver: msg.receiver,
//         message: msg.message,
//         createdAt: msg.createdAt || new Date(),
//       });

//       const savedMsg = await newMsg.save();
//       console.log("✅ Message saved:", savedMsg);

//       io.emit("receiveMessage", { ...savedMsg.toObject(), tempId: msg.tempId });
//     } catch (err) {
//       console.error("❌ Failed to save message:", err);
//     }
//   });

//   socket.on("deleteMessage", ({ id }) => io.emit("messageDeleted", { id }));

//   socket.on("disconnect", () => {
//     console.log("⚠️ Socket disconnected:", socket.id);
//     for (let name in userSockets) {
//       if (userSockets[name] === socket.id) {
//         delete userSockets[name];
//         onlineUsers = onlineUsers.filter((u) => u !== name);
//         io.emit("updateOnlineUsers", onlineUsers);
//         break;
//       }
//     }
//   });
// });

// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require("dotenv").config();

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const Message = require("./src/model/Message");

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// --- SOCKET.IO SETUP ---
const io = new Server(server, {
  cors: {
    origin: [
      "https://chat-application-eight-brown.vercel.app", // frontend URL
      "http://localhost:5173", // local dev
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true, // important for WSS in some deployments
  transports: ["polling"],
});

app.set("io", io);

let onlineUsers = [];
let userSockets = {};

io.on("connection", (socket) => {
  console.log("🌐 Socket connected:", socket.id);

  // Mark user online
  socket.on("userOnline", (name) => {
    userSockets[name] = socket.id;
    if (!onlineUsers.includes(name)) onlineUsers.push(name);
    io.emit("updateOnlineUsers", onlineUsers);
  });

  // Receive and save messages
  socket.on("sendMessage", async (msg) => {
    console.log("📩 Received message:", msg);

    if (!msg.sender || !msg.receiver || !msg.message) {
      console.error("⚠️ Missing required fields:", msg);
      return;
    }

    try {
      const newMsg = new Message({
        sender: msg.sender,
        receiver: msg.receiver,
        message: msg.message,
        createdAt: msg.createdAt || new Date(),
      });

      const savedMsg = await newMsg.save();
      console.log("✅ Message saved:", savedMsg);

      // Emit to all clients
      io.emit("receiveMessage", { ...savedMsg.toObject(), tempId: msg.tempId });
    } catch (err) {
      console.error("❌ Failed to save message:", err);
    }
  });

  // Handle message deletion
  socket.on("deleteMessage", ({ id }) => {
    io.emit("messageDeleted", { id });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("⚠️ Socket disconnected:", socket.id);
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

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
