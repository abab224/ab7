const socket = io();

// DOM要素
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginScreen = document.getElementById("login");
const chatScreen = document.getElementById("chat");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

// ユーザーデータ
let currentUsername;

// ログイン処理
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (password.length === 4) {
    currentUsername = username;
    socket.emit("login", { username });
    loginScreen.classList.add("hidden");
    chatScreen.classList.add("active");
  } else {
    alert("パスワードは4桁の数字で入力してください");
  }
});

// メッセージ送信
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("message", message);
    addMessage({ username: "あなた", message, self: true });
    messageInput.value = "";
  }
});

// メッセージ受信
socket.on("message", (data) => {
  addMessage(data);
});

// 入室・退室メッセージ
socket.on("system", (message) => {
  addSystemMessage(message);
});

// 入室状況の通知
socket.on("status", (message) => {
  addSystemMessage(message);
});

// メッセージを画面に追加
function addMessage({ username, message, self }) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", self ? "sent" : "received");

  if (!self) {
    const usernameElement = document.createElement("div");
    usernameElement.classList.add("message-username");
    usernameElement.textContent = username;
    messageElement.appendChild(usernameElement);
  }

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.textContent = message;

  messageElement.appendChild(bubble);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// システムメッセージを追加
function addSystemMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.style.backgroundColor = "#f0f0f0";
  bubble.style.color = "#333";
  bubble.textContent = message;

  messageElement.appendChild(bubble);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
