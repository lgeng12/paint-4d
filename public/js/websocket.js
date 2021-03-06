
const socket = io();

function sendUpdate(lines) {
  socket.emit('client-update', lines); // Call this line whenever you want to send data to the server
}

socket.on("server-update", lines => {
  console.log(lines);
});

// format:
// {
//   'falaehflbnabu': {points: THREE.Vector3(), color: '#abcdef', width: 1},
//   'vaivbsoabvirbaivbi': {points: THREE.Vector3(), color: '#abcdef', width: 1},
// }