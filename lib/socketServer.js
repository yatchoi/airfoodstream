STREAM_MAGIC_BYTES = 'jsmp';

function SocketServer() {
  this.data = {};
}

SocketServer.prototype.init = function() {
  // Websocket Server
  var socketServer = new (require('ws').Server)({port: 8084}),
      width = 320,
      height = 240;

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

  this.data.server = socketServer;
}

SocketServer.prototype.broadcast = function(data, opts) {
  socketServer = this.getServer();
  for( var i in socketServer.clients ) {
    if (socketServer.clients[i].readyState == 1) {
      // socketServer.clients[i].send(data, opts);
    }
    else {
      console.log( 'Error: Client ('+i+') not connected.' );
    }
  }
};

SocketServer.prototype.getServer = function() {
  console.log(this.data.server);
  return this.data.server;
}

module.exports = SocketServer;
