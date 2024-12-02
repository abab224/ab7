const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// ユーザー情報を保存 (socket.idをキーにする)
let users = {};

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  // ログイン処理
  socket.on("login", ({ username, password }) => {
    // パスワード形式の検証 (大文字1文字 + 数字4桁)
    const passwordRegex = /^[A-Z][0-9]{4}$/;
    if (!passwordRegex.test(password)) {
      socket.emit("error", "パスワードは大文字1文字と数字4桁の形式である必要があります");
      return;
    }

    // ユーザーを登録
    users[socket.id] = { username, password };

    // 既存ユーザーに入室状況を通知
    socket.emit(
      "status",
      Object.keys(users).length > 1
        ? `${Object.values(users)
            .map((user) => user.username)
            .join(", ")} が入室しています`
        : "相手ユーザをお待ちください"
    );

    // 他のユーザーに入室通知を送信
    socket.broadcast.emit("system", `${username} が入室しました`);
  });

  // メッセージ送信
  socket.on("message", (message) => {
    const user = users[socket.id] || { username: "匿名" };
    socket.broadcast.emit("message", { username: user.username, message, self: false });
  });

  // ユーザーの切断
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit("system", `${user.username} が退室しました`);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
