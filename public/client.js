const socket = io();

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  socket.emit("login", { username, password });
});

socket.on("loginSuccess", () => {
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "flex";
});

socket.on("loginError", (error) => {
  alert(error);
});

// メッセージ送信機能
const chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault(); // デフォルトのフォーム送信を無効化

  const messageInput = document.getElementById("message");
  const message = messageInput.value.trim(); // 前後の空白をトリム

  if (!message) return; // メッセージが空の場合は送信しない

  // メッセージをサーバーに送信
  socket.emit("message", { text: message, senderId: socket.id });

  // 自分のメッセージを即座に表示
  appendMessage({ username: "自分", message, self: true });

  messageInput.value = ""; // 入力フィールドをクリア
});

socket.on("message", (data) => {
  appendMessage(data);
});

// メッセージを画面に追加
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
  chatBox.scrollTop = chatBox.scrollHeight; // 最新メッセージへスクロール
}
