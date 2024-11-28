const socket = io();

document.getElementById("login-button").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    socket.emit("login", { username, password });
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "flex";
  }
});

document.getElementById("send-button").addEventListener("click", () => {
  const message = document.getElementById("message").value;
  socket.emit("message", message);
  document.getElementById("message").value = "";
});

socket.on("message", (data) => {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", data.self ? "self" : "other");

  const contentElement = document.createElement("div");
  contentElement.classList.add("message-content", data.self ? "self" : "other");
  contentElement.textContent = data.username + ": " + data.message;

  messageElement.appendChild(contentElement);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
});
