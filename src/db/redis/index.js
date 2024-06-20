const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../../settings");

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
  console.info("Connected to Redis");
});

client.on(statusConnect.END, () => {
  console.info("Disconnected to Redis");
});

client.on(statusConnect.ERROR, (err) => {
  console.info("Disconnected to Redis");
  console.info(`${err}`);
});

client.on(statusConnect.RECONNECT, () => {
  console.info("Reconnection to Redis");
});

module.exports = client;
