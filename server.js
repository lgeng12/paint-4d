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

var serverData = {}; // everyone's data
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

  console.log("new connection: " + socket.id);

  // ok you're in
  socket.emit("connection-approve", socket.id);
  socket.emit("server-update", serverData); // Send current list of lines

  // what to do when client sends us a message titled 'client-update'
  socket.on("client-update", function(new_lines) {
    // Data packet format:
    // new_lines is in the exact same format as serverData
    // Assumption: serverData in data are new and not already in serverData

    // CASEY
    // packet.data == packet["data"]
    // serverData = Object.assign({}, serverData, new_lines);
    for (let client_id in new_lines) {
      if (serverData[client_id] == undefined)
        serverData[client_id] = {};
      serverData[client_id] = Object.assign({}, serverData[client_id], new_lines[client_id]);
    }
    socket.broadcast.emit("server-update", new_lines);
  });
  
  socket.on("client-clear", function(client_id) {
    socket.broadcast.emit("server-clear", client_id);
    delete serverData[client_id];
  });
  
  socket.on("client-undo", function(line_id) {
    socket.broadcast.emit("server-undo", socket.id, line_id);
    delete serverData[socket.id][line_id];
  });

  // every couple milliseconds we send to this client
  // the data of everybody else

  // setInterval(f,t) = run function f every t milliseconds

  // the client disconnected, let's wipe up after them
  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
    socket.broadcast.emit("server-clear", socket.id);
    delete serverData[socket.id];
  });
}


//////////////// FIREBASE STUFF ////////////////

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FIRESTORE PROJECT ID ###'
});

app.get("db/load", function (req, res) {
  var filename = req.query.filename;
  
  res.send("the lines data");
});
app.get("db/save", function (req, res) {
  var filename = req.query.filename;
  
  res.send("the lines data");
});

var db = firebase.firestore();