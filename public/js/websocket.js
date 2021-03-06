
const socket = io();

function sendData() {
  socket.emit('client-update', {whatever data you want to send to the server}); // Call this line whenever you want to send data to the server