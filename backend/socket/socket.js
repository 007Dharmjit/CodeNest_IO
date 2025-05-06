const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`Left room: ${roomId}`);
    });

    socket.on("sendMessage", async (message) => { 
      try {
        // Emit the merossage to the om (without saving to database)
        io.to(message.roomId).emit("receiveMessage", message); 
      } catch (error) {
        console.error("Error emitting message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};