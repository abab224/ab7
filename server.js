const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {};

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました。");

  socket.on("login", ({ username, password }) => {
    if (username && password) {
      users[socket.id] = { username, password };
      socket.emit("loginSuccess");
      io.emit("systemMessage", `${username} が入室しました`);
    } else {
      socket.emit("loginError", "ユーザー名とパスワードを入力してください");
    }
  });

  socket.on("message", (data) => {
    io.emit("message", {
      username: users[socket.id]?.username || "匿名",
      message: data.text,
      senderId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.emit("systemMessage", `${user.username} が退室しました`);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});
