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

document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value;
  if (!message) return;

  socket.emit("message", { text: message, senderId: socket.id });

  appendMessage({ username: "自分", message, self: true });
  document.getElementById("message").value = "";
});

socket.on("message", (data) => {
  appendMessage(data);
});

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
