const mongoose = require("mongoose");
const colors = require("colors");
const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DATABASE,
} = require("../../settings");

class Database {
  constructor() {
    this.connectString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
    this.connect();
  }
  connect() {
    mongoose
      .connect(this.connectString, {
        dbName: MONGO_DATABASE,
      })
      .then((_) => {
        console.log(colors.green(`INFO:     `), "Connected to MongoDB");
      })
      .catch((error) => {
        console.log(colors.red(`ERROR:     `), `${error}`);
      });
  }
  //
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();
module.exports = instance;
