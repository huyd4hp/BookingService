const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../../settings");
const colors = require("colors");
let statusConnect = {
  CONNECT: "connect",
  END: "end",
  ERROR: "error",
  RECONNECT: "reconnecting",
};
const client = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

client.on(statusConnect.CONNECT, () => {
  console.log(colors.green(`INFO:     `), "Connected to Redis");
});

client.on(statusConnect.END, () => {
  console.log(colors.green(`INFO:     `), "Disconnected to Redis");
});

client.on(statusConnect.ERROR, (err) => {
  console.log(colors.red(`ERROR:     `), `REDIS: ${err}`);
});

client.on(statusConnect.RECONNECT, () => {
  console.log(colors.yellow(`INFO:     `), "Reconnection to Redis");
});

module.exports = client;
