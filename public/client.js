const socket = io();

// ログインフォーム送信時の処理
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault(); // デフォルトのフォーム送信を防ぐ

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("ユーザー名とパスワードを入力してください");
    return;
  }

  // サーバーにログイン情報を送信
  socket.emit("login", { username, password });
});

// サーバーからログイン成功を受信
socket.on("loginSuccess", () => {
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
});

// ログインエラーを受信
socket.on("loginError", (error) => {
  alert(error);
});

// チャット送信時の処理
document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value;
  if (!message) return;

  socket.emit("message", message);

  // 自分のメッセージを右側に表示
  appendMessage({ username: "自分", message, self: true });

  document.getElementById("message").value = "";
});

// メッセージを受信したときの処理
socket.on("message", (data) => {
  appendMessage(data);
});

// メッセージを画面に追加する関数
function appendMessage(data) {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");

  messageElement.classList.add("message");
  messageElement.classList.add(data.self ? "self" : "other");

  if (!data.self) {
    const usernameElement = document.createElement("div");
    usernameElement.classList.add("username");
    usernameElement.textContent = data.username;
    messageElement.appendChild(usernameElement);
  }

  const textElement = document.createElement("div");
  textElement.classList.add("text");
  textElement.textContent = data.message;
  messageElement.appendChild(textElement);

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
