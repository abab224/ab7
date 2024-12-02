const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  socket.on("login", ({ username }) => {
    users[socket.id] = username;

    // 既存のユーザーに入室状況を通知
    socket.emit(
      "status",
      Object.keys(users).length > 1
        ? `${Object.values(users).join(", ")} が入室しています`
        : "相手ユーザをお待ちください"
    );

    // 入室通知
    socket.broadcast.emit("system", `${username} が入室しました`);
  });

  socket.on("message", (message) => {
    const username = users[socket.id] || "匿名";
    socket.broadcast.emit("message", { username, message, self: false });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit("system", `${username} が退室しました`);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
