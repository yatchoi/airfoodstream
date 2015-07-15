STREAM_MAGIC_BYTES = 'jsmp';
port = 8084;

function SocketServer() {
  var socketServer = new (require('ws').Server)({port: port}),
      width = 320,
      height = 240;

  // Websocket Server
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

  port += 1;

  return socketServer
}

module.exports = SocketServer;
