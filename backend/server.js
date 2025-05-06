const express = require("express");
const cors = require("cors"); 
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./models/Message.model");
const connectDB = require("./config/db");
const Problem = require("./models/problem.model");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update if frontend runs on a different port
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors()); 

// Connect Database
connectDB();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", async (message) => {
    console.log("Message received:", message); 
    const roomId = [message.userId, message.friendID].sort().join("-");
    try {
      // Save message to MongoDB
      const newMessage = new Message({
        userId: message.userId,
        friendID: message.friendID,
        text: message.text,
        roomId,
        user: message.user,
        timestamp: new Date(),
      });

      await newMessage.save();

      // Emit message to the correct room
      io.to(roomId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Route to get messages between users
app.get("/api/messages/:userId/:friendID", async (req, res) => {
  try {
    const { userId, friendID } = req.params; 
    console.log(userId,friendID,"ids")
    const roomId = [userId, friendID].sort().join("-");

    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    console.log(messages,'mssage')
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.use("/api/Auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/Folder", require("./routes/folder.routes"));

server.listen(3001, () => { 
  console.log("Server Start At port 3001");
});
