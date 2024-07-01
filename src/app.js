const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const RedisClient = require("./db/redis");
const CronJob = require("./ultis/cron");
const consumer = require("./ultis/kafka_consumer");
const http = require("http");
const SocketServer = require("./socket");
// App - Socket
const app = express();
const server = http.createServer(app);
const socket = new SocketServer(server);
// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
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
  server,
  socket,
};
