const http = require("http");
const socketIo = require("socket.io");

class SocketServer {
  constructor(app, options = {}) {
    this.server = http.createServer(app);
    this.io = socketIo(this.server, options);
    this.io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  emit(event, data) {
    this.io.emit(event, data);
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }
}

module.exports = SocketServer;
