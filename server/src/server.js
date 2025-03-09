const http = require("node:http");
const app = require("./app");
const connectDB = require("./db/connector");

const PORT = process.env.PORT || 5000;

// Sockets connections
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
  pingTimeout: 50000
});

io.on("connection", (socket) => {
  console.log("User connected to the socket server");

  socket.on("room", (room) => {
    socket.join(room);

    socket.on("msg", (content) => {
      socket.to(room).emit("msg",content);
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected from socket server");
  })
});

const init = () => {
  try {
    connectDB().then(() => {
      server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
  }
  catch (error) {
    console.log(error.message);
  }
}

init();