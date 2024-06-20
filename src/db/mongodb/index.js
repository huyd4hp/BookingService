const mongoose = require("mongoose");
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
    if (2 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(this.connectString, {
        dbName: MONGO_DATABASE,
      })
      .then((_) => {
        console.info("Connected to MongoDB");
      })
      .catch((error) => console.log(`Error:  ${error}!`));
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
