
/* global describe io*/
var socket = io();
socket.on('connection-approve', function(data){
  console.log("Approved!")
})


// socket.on("server-update", lines => {
//   console.log(lines);
// });

// format:
// {
//   'falaehflbnabu': {points: THREE.Vector3(), color: '#abcdef', width: 1},
//   'vaivbsoabvirbaivbi': {points: THREE.Vector3(), color: '#abcdef', width: 1},
// }