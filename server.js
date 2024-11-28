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

  // ユーザーがログイン
  socket.on("login", (data) => {
    users[socket.id] = data.username;
    io.emit("systemMessage", { 
      username: data.username, 
      message: "が入室しました" 
    });
  });

  // ユーザーがメッセージを送信
  socket.on("message", (message) => {
    const username = users[socket.id] || "匿名";
    io.emit("message", { 
      username, 
      message, 
      self: socket.id === socket.id 
    });
  });

  // ユーザーが切断
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("systemMessage", { 
        username, 
        message: "が退室しました" 
      });
      delete users[socket.id];
    }
  });
});

// サーバーを開始
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
