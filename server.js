const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000;

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  socket.on("login", (data) => {
    users[socket.id] = data.username;
    io.emit("message", { username: data.username, message: "が入室しました", self: false });
  });

  socket.on("message", (message) => {
    const username = users[socket.id] || "匿名";
    io.emit("message", { username, message, self: false });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("message", { username, message: "が退室しました", self: false });
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
