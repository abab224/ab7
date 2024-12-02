const socket = io();
const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// ユーザー情報
let username = prompt("ユーザー名を入力してください:");
socket.emit("login", { username });

// メッセージ送信イベント
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("message", { username, message });
    addMessage({ username, message, self: true });
    messageInput.value = "";
  }
});

// メッセージ受信イベント
socket.on("message", (data) => {
  addMessage(data);
});

// メッセージ表示関数
function addMessage(data) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(data.self ? "sent" : "received");

  const bubbleElement = document.createElement("div");
  bubbleElement.classList.add("message-bubble");

  if (!data.self) {
    const usernameElement = document.createElement("div");
    usernameElement.classList.add("username");
    usernameElement.textContent = data.username;
    messageElement.appendChild(usernameElement);
  }

  bubbleElement.textContent = data.message;
  messageElement.appendChild(bubbleElement);
  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight; // スクロールを最下部に
}
