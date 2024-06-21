const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { ACCESS_KEY } = require("./settings");
class SocketServer {
  constructor(server) {
    this.socketService = new Server(server);
    this.socketService.on("connection", (socket) => {
      const token = socket.handshake.headers.authorization;
      if (!token) {
        socket.emit("Connect", { message: "Missing Token" });
        socket.disconnect(true);
        return;
      }
      jwt.verify(token, ACCESS_KEY, (err, payload) => {
        if (err) {
          socket.emit("Connect", { message: "Invalid Token" });
          socket.disconnect(true);
          return;
        }
        socket.emit("Connect", { message: "Accept", user: payload._id });
        socket.join(payload._id);
        socket.on("disconnect", () => {});
      });
    });
  }
  push(ROOM, EVENT, DATA) {
    this.socketService.to(ROOM).emit(EVENT, DATA);
  }
}
module.exports = SocketServer;
