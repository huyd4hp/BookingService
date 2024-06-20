const { server, io } = require("./src/app");
const { PORT } = require("./src/settings");

server.listen(PORT, () => {
  console.info(`Application listening on ${PORT}`);
});

process.on("SIGINT", () => {
  console.info("Application stopped");
  server.close();
  process.exit(0);
});
