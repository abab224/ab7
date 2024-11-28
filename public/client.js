socket.on("message", (data) => {
  const chatBox = document.getElementById("chat-box");

  // メッセージのコンテナ
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", data.self ? "self" : "other");

  // 相手のメッセージにユーザー名を表示
  if (!data.self) {
    const usernameElement = document.createElement("div");
    usernameElement.classList.add("username");
    usernameElement.textContent = data.username; // ユーザー名を追加
    messageElement.appendChild(usernameElement);
  }

  // メッセージの内容
  const contentElement = document.createElement("div");
  contentElement.classList.add("message-content", data.self ? "self" : "other");
  contentElement.textContent = data.message;

  messageElement.appendChild(contentElement);
  chatBox.appendChild(messageElement);

  // スクロールを一番下に
  chatBox.scrollTop = chatBox.scrollHeight;
});
