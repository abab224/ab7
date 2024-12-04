const socket = io(); // サーバーとのWebSocket通信を行うためのSocket.IOクライアントを初期化

// DOM要素の取得
const loginForm = document.getElementById("loginForm"); // ログインフォームの要素
const usernameInput = document.getElementById("username"); // ユーザー名入力フィールド
const passwordInput = document.getElementById("password"); // パスワード入力フィールド
const loginScreen = document.getElementById("login"); // ログイン画面
const chatScreen = document.getElementById("chat"); // チャット画面
const chatBox = document.getElementById("chatBox"); // チャットメッセージを表示するエリア
const messageInput = document.getElementById("message"); // メッセージ入力フィールド
const sendButton = document.getElementById("send"); // メッセージ送信ボタン

// 現在のユーザー名を保持する変数
let currentUsername;

// ログイン処理
loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // フォーム送信時のページリロードを防止
  const username = usernameInput.value.trim(); // ユーザー名の入力値を取得（空白を除去）
  const password = passwordInput.value.trim(); // パスワードの入力値を取得（空白を除去）

  // パスワード形式の検証 (大文字1文字 + 数字4桁)
  const passwordRegex = /^[A-Z][0-9]{4}$/; // 正規表現パターンを定義
  if (!passwordRegex.test(password)) { // 入力されたパスワードが形式に一致しない場合
    alert("パスワードは大文字1文字と数字4桁の形式である必要があります"); // エラーメッセージを表示
    return; // 処理を中断
  }

  // ユーザー名を保持
  currentUsername = username;

  // サーバーにログイン情報を送信
  socket.emit("login", { username, password });

  // ログイン画面を非表示にし、チャット画面を表示
  loginScreen.classList.add("hidden");
  chatScreen.classList.add("active");
});

// メッセージ送信処理
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim(); // 入力されたメッセージを取得（空白を除去）
  if (message) { // メッセージが空でない場合
    socket.emit("message", message); // サーバーにメッセージを送信
    addMessage({ username: "あなた", message, self: true }); // 自分の送信したメッセージを画面に表示
    messageInput.value = ""; // メッセージ入力フィールドをクリア
  }
});

// サーバーからのメッセージ受信処理
socket.on("message", (data) => {
  addMessage(data); // 受信したメッセージを画面に追加
});

// サーバーからのシステムメッセージ受信処理
socket.on("system", (message) => {
  addSystemMessage(message); // 受信したシステムメッセージを画面に追加
});

// 入室状況の通知を受信
socket.on("status", (message) => {
  addSystemMessage(message); // 受信したステータスメッセージを画面に追加
});

// サーバーからのエラーメッセージ受信処理
socket.on("error", (errorMessage) => {
  alert(errorMessage); // エラーメッセージをアラート表示
});

// メッセージを画面に追加する関数
function addMessage({ username, message, self }) {
  const messageElement = document.createElement("div"); // メッセージ用のdiv要素を作成
  messageElement.classList.add("message", self ? "sent" : "received"); // 自分のメッセージか相手のメッセージかでスタイルを変更

  if (!self) { // 相手からのメッセージの場合
    const usernameElement = document.createElement("div"); // ユーザー名表示用のdiv要素を作成
    usernameElement.classList.add("message-username"); // ユーザー名のスタイルを設定
    usernameElement.textContent = username; // ユーザー名を設定
    messageElement.appendChild(usernameElement); // メッセージ要素にユーザー名を追加
  }

  const bubble = document.createElement("div"); // メッセージ本文用のdiv要素を作成
  bubble.classList.add("message-bubble"); // メッセージバブルのスタイルを設定
  bubble.textContent = message; // メッセージ本文を設定

  messageElement.appendChild(bubble); // メッセージバブルをメッセージ要素に追加
  chatBox.appendChild(messageElement); // チャットボックスにメッセージ要素を追加
  chatBox.scrollTop = chatBox.scrollHeight; // チャットボックスをスクロールして最新メッセージを表示
}

// システムメッセージを画面に追加する関数
function addSystemMessage(message) {
  const messageElement = document.createElement("div"); // メッセージ用のdiv要素を作成
  messageElement.classList.add("message"); // システムメッセージのスタイルを設定

  const bubble = document.createElement("div"); // メッセージ本文用のdiv要素を作成
  bubble.classList.add("message-bubble"); // メッセージバブルのスタイルを設定
  bubble.style.backgroundColor = "#f0f0f0"; // システムメッセージ用の背景色を設定
  bubble.style.color = "#333"; // システムメッセージ用の文字色を設定
  bubble.textContent = message; // メッセージ本文を設定

  messageElement.appendChild(bubble); // メッセージバブルをメッセージ要素に追加
  chatBox.appendChild(messageElement); // チャットボックスにメッセージ要素を追加
  chatBox.scrollTop = chatBox.scrollHeight; // チャットボックスをスクロールして最新メッセージを表示
}
