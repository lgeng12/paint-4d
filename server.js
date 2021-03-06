


tron-racer

Show
server.js
// server.js
// this is the "hub" where player's data got sent to each other
​
const MAX_PLAYERS = 16; // maximum number of players
​
// express (https://expressjs.com/) is a simple node.js framework for writing servers
const express = require("express");
const app = express();
var server = app.listen(process.env.PORT || 300);
​
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
​
// socket.io is a simple library for networking
var io = require('socket.io')(server);
​
// socket.io quick start:
// to send a message:               socket.emit(title,data);
// to deal with a received message: socket.on(title,function(data){ frob(data); })
​
var serverData = {}; // everyone's data
var numPlayers = 0; // current number of players
​
console.log("listening...")
​
// what to do when there's a new player connection:
io.sockets.on('connection', newConnection);
function newConnection(socket) {
  // "socket" now refers to this particular new player's connection
​
  console.log('new connection: ' + socket.id);
​
  // if there're too many players, reject player's request to join
  if (numPlayers >= MAX_PLAYERS) {
    socket.emit("connection-reject");
    return;
  }
  numPlayers++;
​
  // ok you're in
  socket.emit("connection-approve");
​
  // what to do when client sends us a message titled 'client-update'
  socket.on('client-update', function (data) {
    serverData[socket.id] = data;
  })
​
  // every couple milliseconds we send to this client
  // the data of everybody else
​
  // setInterval(f,t) = run function f every t milliseconds
​
  let timer = setInterval(function () {
    var others = {};
    for (var k in serverData) {
      if (k != socket.id) {
        others[k] = serverData[k];
      }
    }
    socket.emit('server-update', serverData);
  }, 15);
​
​
