const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let users = {};
let rooms = {}; // パスワードごとにユーザーを分ける

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  socket.on("login", ({ username, password }) => {
    const passwordRegex = /^[A-Z][0-9]{4}$/;
    if (!passwordRegex.test(password)) {
      socket.emit("error", "パスワードは大文字1文字と数字4桁の形式である必要があります");
      return;
    }

    users[socket.id] = { username, password };

    if (!rooms[password]) {
      rooms[password] = [];
    }
    rooms[password].push(socket.id);

    socket.join(password); // パスワードをルーム名として使用
    socket.emit("status", `${username} がルームに入りました`);
    socket.to(password).emit("system", `${username} が入室しました`);
  });

  socket.on("message", (message) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.password).emit("message", {
        username: user.username,
        message,
        self: false,
      });
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const room = rooms[user.password];
      if (room) {
        rooms[user.password] = room.filter((id) => id !== socket.id);
        if (rooms[user.password].length === 0) {
          delete rooms[user.password];
        }
      }
      socket.to(user.password).emit("system", `${user.username} が退室しました`);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
