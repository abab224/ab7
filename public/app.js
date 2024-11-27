const socket = io();

document.getElementById('login-button').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    socket.emit('login', { username, password });
  }
});

socket.on('loginSuccess', ({ username }) => {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.remove('hidden');
});

document.getElementById('send-button').addEventListener('click', () => {
  const message = document.getElementById('message-input').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (message) {
    socket.emit('message', { password, message, username });
    document.getElementById('message-input').value = '';
  }
});

socket.on('message', ({ username, message }) => {
  const messages = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(username === document.getElementById('username').value ? 'right' : 'left');
  messageElement.textContent = `${username}: ${message}`;
  messages.appendChild(messageElement);
});
