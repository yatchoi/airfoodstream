var express = require('express');
var router = express.Router();
var Store = require('../lib/store');
var SocketServer = require('../lib/socketServer');

var store = new Store();

router.post('/:id/data', function(req, res) {
  var id = req.params.id;

  store.add(id, req.body);
  console.log(store.getLast(id));
  res.json({ status: 'ok' });
});

router.post('/:id/stream', function(req, res) {
  width = 320;
  height = 240;

  console.log(
    'Stream Connected: ' + req.socket.remoteAddress +
    ':' + req.socket.remotePort + ' size: ' + width + 'x' + height
  );

  // Websocket Server
  var socketServer = new (require('ws').Server)({port: 8084});
  socketServer.on('connection', function(socket) {
    // Send magic bytes and video size to the newly connected socket
    // struct { char magic[4]; unsigned short width, height;}
    var streamHeader = new Buffer(8);
    streamHeader.write(STREAM_MAGIC_BYTES);
    streamHeader.writeUInt16BE(width, 4);
    streamHeader.writeUInt16BE(height, 6);
    socket.send(streamHeader, {binary:true});

    console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );

    socket.on('close', function(code, message){
      console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
    });
  });

  socketServer.broadcast = function(data, opts) {
    for( var i in this.clients ) {
      if (this.clients[i].readyState == 1) {
        this.clients[i].send(data, opts);
      }
      else {
        console.log( 'Error: Client ('+i+') not connected.' );
      }
    }
  };

  req.on('data', function(data){
    socketServer.broadcast(data, {binary:true});
  });
});

module.exports = router;
