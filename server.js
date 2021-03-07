require("dotenv").config();
// server.js
// this is the "hub" where player's data got sent to each other

// express (https://expressjs.com/) is a simple node.js framework for writing servers
const express = require("express");
const app = express();
var server = app.listen(process.env.PORT || 8080);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// socket.io is a simple library for networking
var io = require("socket.io")(server);

// socket.io quick start:
// to send a message:               socket.emit(title,data);
// to deal with a received message: socket.on(title,function(data){ frob(data); })

var lines = {}; // everyone's data
// format:
// {
//   'falaehflbnabu': {points: THREE.Vector3(), color: '#abcdef', width: 1},
//   'vaivbsoabvirbaivbi': {points: THREE.Vector3(), color: '#abcdef', width: 1},
// }

console.log("listening...");

// what to do when there's a new player connection:
io.sockets.on("connection", newConnection);
function newConnection(socket) {
  // "socket" now refers to this particular new player's connection

  console.log("new conection: " + socket.id);

  // ok you're in
  socket.emit("connection-approve");
  socket.emit("server-update", lines); // Send current list of lines

  // what to do when client sends us a message titled 'client-update'
  socket.on("client-update", function(new_lines) {
    // Data packet format:
    // new_lines is in the exact same format as lines
    // Assumption: lines in data are new and not already in lines

    // CASEY
    // packet.data == packet["data"]
    lines = Object.assign({}, lines, new_lines);
    socket.broadcast.emit("server-update", new_lines);
  });
  
  socket.on("client-clear", function(cleared_lines) {
    
  });

  // every couple milliseconds we send to this client
  // the data of everybody else

  // setInterval(f,t) = run function f every t milliseconds

  // the client disconnected, let's wipe up after them
  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
  });
}
