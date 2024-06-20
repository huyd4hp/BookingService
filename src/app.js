const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const RedisClient = require("./db/redis");
const CronJob = require("./ultis/cron");
const http = require("http");
const { Server } = require("socket.io");
const consumer = require("./ultis/kafka_consumer");
// App - Socket
const app = express();
const server = http.createServer(app);
const socketService = new Server(server);
socketService.on("connection", (socket) => {
  console.log("New Connected:", socket.handshake.address);
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.handshake.address);
  });
});
// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(require("./auth/login_required"));
// Consumer
consumer.connect().catch(console.error);
// Database
require("./db/mongodb");
CronJob();
RedisClient.connect();
// Router
app.use("/api/v1", require("./router"));
// Handle Error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const statusError = err.status || 500;
  const messageError = err.message || "Internal Server Error";
  return res.status(statusError).json({
    status: "error",
    message: messageError,
  });
});
// Export
module.exports = {
  app,
  server,
  socketService,
};
