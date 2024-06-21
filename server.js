const { server } = require("./src/app");
const { PORT } = require("./src/settings");
const consumer = require("./src/ultis/kafka_consumer");

server.listen(PORT, () => {
  console.info(`Application listening on ${PORT}`);
});

process.on("SIGINT", async () => {
  await consumer.disconnect();
  console.info("Application stopped");
  server.close();
  process.exit(0);
});
