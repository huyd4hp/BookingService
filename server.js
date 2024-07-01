const { server } = require("./src/app");
const colors = require("colors");
const { PORT } = require("./src/settings");
const consumer = require("./src/ultis/kafka_consumer");

colors.enable();
server.listen(PORT, () => {
  console.log(colors.green(`INFO:     `), `Application listening on ${PORT}`);
});

process.on("SIGINT", async () => {
  await consumer.disconnect();
  console.log(colors.green(`INFO:     `), "Application stopped");
  console.info();
  server.close();
  process.exit(0);
});
