const users = {}; // 接続中のユーザーを管理

io.on('connection', (socket) => {
  console.log('A user connected');

  // 入室時の処理
  socket.on('user join', (username) => {
    users[socket.id] = username;
    io.emit('user join', username); // 全員に通知
  });

  // チャットメッセージの受信
  socket.on('chat message', (data) => {
    io.emit('chat message', data); // 全員に送信
  });

  // 切断時の処理
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    if (username) {
      io.emit('user leave', username); // 全員に通知
    }
    console.log('A user disconnected');
  });
});
