const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000;

// 静的ファイルの提供
app.use(express.static('public'));

// ユーザー管理用オブジェクト
const users = {};

// WebSocketイベント
io.on('connection', (socket) => {
  console.log('ユーザーが接続しました');

  socket.on('login', ({ username, password }) => {
    if (!users[password]) {
      users[password] = [];
    }
    users[password].push({ id: socket.id, username });
    socket.join(password);
    socket.emit('loginSuccess', { username });
  });

  socket.on('message', ({ password, message, username }) => {
    io.to(password).emit('message', { username, message });
  });

  socket.on('disconnect', () => {
    console.log('ユーザーが切断しました');
    Object.keys(users).forEach((password) => {
      users[password] = users[password].filter((user) => user.id !== socket.id);
    });
  });
});

// サーバー起動
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
