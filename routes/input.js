var express = require('express');
var router = express.Router();
var Store = require('../lib/store');
var createSocketServer = require('../lib/socketServer');

// wow global variables
store = new Store();
serverMap = {};

// var socketServer = new (require('ws').Server)({port: 8084}),
//     width = 320,
//     height = 240;

// // Websocket Server
// socketServer.on('connection', function(socket) {
//   // Send magic bytes and video size to the newly connected socket
//   // struct { char magic[4]; unsigned short width, height;}
//   var streamHeader = new Buffer(8);
//   streamHeader.write(STREAM_MAGIC_BYTES);
//   streamHeader.writeUInt16BE(width, 4);
//   streamHeader.writeUInt16BE(height, 6);
//   socket.send(streamHeader, {binary:true});

//   console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

//   socket.on('close', function(code, message){
//     console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
//   });
// });

// socketServer.broadcast = function(data, opts) {
//   for( var i in this.clients ) {
//     if (this.clients[i].readyState == 1) {
//       this.clients[i].send(data, opts);
//     }
//     else {
//       console.log( 'Error: Client ('+i+') not connected.' );
//     }
//   }
// };

router.post('/:id/data', function(req, res) {
  var id = req.params.id;

  store.add(id, req.body);
  console.log(store.getLast(id));
  res.json({ status: 'ok' });
});

router.post('/:id/stream', function(req, res) {
  console.log(
    'Stream Connected: ' + req.socket.remoteAddress +
    ':' + req.socket.remotePort
  );

  var key = 'server-' + req.param('id');
  var socketServer;

  if (serverMap[key] == null) {
    socketServer = createSocketServer();
    console.log("Creating new socketServer at port: " + socketServer.options.port);
    serverMap[key] = socketServer;
  }
  else {
    socketServer = serverMap[key];
    console.log("Getting existing socketServer: " + socketServer.options.port);
  }

  req.on('data', function(data) {
    socketServer.broadcast(data, {binary:true});
  });
});

module.exports = router;
