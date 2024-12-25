import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("set-username", (data) => {
    console.log('username: ', data);
    socket.data.username = data;
    console.log('username set to: ', socket.data.username);
  });

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
    // socket.broadcast.emit("message", message);
  });

  socket.on("typing", (data) => {
    console.log(data, socket.data.username);
    socket.broadcast.emit("typing", {
      username: socket.data.username,
      data,
    });
  });

  socket.on("typing-stopped", () => {
    socket.broadcast.emit("typing-stopped");
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
