// 必要なモジュールをインポート
const express = require("express"); // Webサーバーを構築するためのフレームワーク
const http = require("http"); // HTTPサーバーを作成するモジュール
const { Server } = require("socket.io"); // WebSocketを簡単に扱えるライブラリ

// Expressアプリケーションとサーバーを初期化
const app = express();
const server = http.createServer(app); // HTTPサーバーをExpressアプリケーションで構築
const io = new Server(server); // WebSocket用のサーバーを初期化

// サーバーが待ち受けるポート番号
const PORT = process.env.PORT || 3000;

// 静的ファイルを提供 (publicディレクトリ内のファイル)
app.use(express.static("public"));

// ユーザー情報を保存するオブジェクト
// キー: `socket.id` (接続固有のID)
// 値: ユーザー情報 (usernameとpassword)
let users = {};
let rooms = {}; // パスワードごとにユーザーを分ける

// WebSocketの接続処理
io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  // ログイン処理 (クライアントから"login"イベントを受け取ったとき)
  socket.on("login", ({ username, password }) => {
    // パスワード形式を正規表現で検証 (大文字1文字 + 数字4桁)
    const passwordRegex = /^[A-Z][0-9]{4}$/;
    if (!passwordRegex.test(password)) {
      // パスワード形式が不正の場合、エラーメッセージをクライアントに送信
      socket.emit("error", "パスワードは大文字1文字と数字4桁の形式である必要があります");
      return;
    }

    // ユーザー情報を`users`オブジェクトに保存
    users[socket.id] = { username, password };
     // パスワードごとにルームを作成・管理
     if (!rooms[password]) {
      rooms[password] = [];
    }
    rooms[password].push(socket.id);

    // ユーザーをパスワードに基づくルームに参加させる
    socket.join(password);

    // 入室状況を送信 (接続したユーザーに現在の状況を通知)
    socket.emit(
      "status",
      Object.keys(users).length > 1 // ユーザーが複数いる場合
        ? `${Object.values(users)
            .map((user) => user.username) // 全ユーザー名を取得
            .join(", ")} が入室しています` // 入室中のユーザー一覧を表示
        : "相手ユーザをお待ちください" // 他のユーザーがいない場合
    );

    // 他のユーザーに新しいユーザーの入室を通知
    socket.broadcast.emit("system", `${username} が入室しました`);
  });

  // メッセージ送信処理 (クライアントから"message"イベントを受け取ったとき)
  socket.on("message", (message) => {
    // メッセージを送信したユーザー情報を取得
    const user = users[socket.id] || { username: "匿名" }; // 不明な場合は匿名
    // 他の全ユーザーにメッセージを送信
    socket.broadcast.emit("message", { username: user.username, message, self: false });
  });

  // 切断処理 (ユーザーが接続を終了したとき)
  socket.on("disconnect", () => {
    const user = users[socket.id]; // 切断するユーザー情報を取得
    if (user) {
      // 他のユーザーに切断したことを通知
      socket.broadcast.emit("system", `${user.username} が退室しました`);
      // ユーザー情報を削除
      delete users[socket.id];
    }
  });
});

// サーバーを指定したポートで起動
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // サーバー起動時にログを出力
});
