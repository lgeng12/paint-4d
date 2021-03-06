// server.js
// this is the "hub" where player's data got sent to each other

// express (https://expressjs.com/) is a simple node.js framework for writing servers
const express = require("express");
const app = express();
var server = app.listen(process.env.PORT || 300);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// socket.io is a simple library for networking
var io = require('socket.io')(server);

// socket.io quick start:
// to send a message:               socket.emit(title,data);
// to deal with a received message: socket.on(title,function(data){ frob(data); })

var coords = {}; // everyone's data



console.log("listening...")

// what to do when there's a new player connection:
io.sockets.on('connection', newConnection);
function newConnection(socket) {
  // "socket" now refers to this particular new player's connection

  console.log('new connection: ' + socket.id);

  // ok you're in
  socket.emit("connection-approve");

  // what to do when client sends us a message titled 'client-update'
  socket.on('client-update', function (data) {
    // Data packet format:
    // {type: 'coord'|'other', data: [the data]}
    
    
    // CASEY
  })

  // every couple milliseconds we send to this client
  // the data of everybody else

  // setInterval(f,t) = run function f every t milliseconds

  let timer = setInterval(function () {
    var others = {};
    for (var k in serverData) {
      if (k != socket.id) {
        others[k] = serverData[k];
      }
    }
    socket.emit('server-update', serverData);
  }, 15);


  //   // the client disconnected, let's wipe up after them
  socket.on('disconnect', function () {
    clearInterval(timer); // cancel the scheduled updates we set up earlier
    delete serverData[socket.id];
    console.log(socket.id + ' disconnected');
    numPlayers--;
  });
}



