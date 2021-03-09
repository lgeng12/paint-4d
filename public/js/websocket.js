
/* global describe io*/
var socket = io();
var client_id = 0;
socket.on('connection-approve', function(data){
  console.log("Approved!")
  client_id = data;
})


// socket.on("server-update", lines => {
//   console.log(lines);
// });

// format:
// {
//   'falaehflbnabu': {points: THREE.Vector3(), color: '#abcdef', width: 1},
//   'vaivbsoabvirbaivbi': {points: THREE.Vector3(), color: '#abcdef', width: 1},
// }


function showHelp() {
  $("#helloModal").modal("show");
}
showHelp();