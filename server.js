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
    const { username, password } = data;

    if (!username || !password || password.length !== 4 || isNaN(password)) {
      socket.emit("loginError", "正しいユーザー名と4桁の数字パスワードを入力してください");
      return;
    }

    // ユーザー情報を登録
    users[socket.id] = username;

    // ログイン成功を通知
    socket.emit("loginSuccess");

    // 入室メッセージを送信
    io.emit("message", { username, message: "が入室しました", self: false });
  });

  socket.on("message", (message) => {
    const username = users[socket.id] || "匿名";
    io.emit("message", { username, message, self: socket.id === message.senderId });
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
