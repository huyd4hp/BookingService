require("dotenv").config();
// App
PORT = process.env.PORT || 5051;
// Mongo
MONGO_HOST = process.env.MONGO_HOST || "127.0.0.1";
MONGO_PORT = +process.env.MONGO_PORT || 27017;
MONGO_USERNAME = process.env.MONGO_USERNAME || root;
MONGO_PASSWORD = process.env.MONGO_PASSWORD || rootMongo;
MONGO_DATABASE = process.env.MONGO_DATABASE || Booking;
// Redis
REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
REDIS_PORT = +process.env.REDIS_PORT || 6379;
// Secret key
ACCESS_KEY = process.env.ACCESS_KEY;
REFRESH_KEY = process.env.REFRESH_KEY;
module.exports = {
  PORT,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  REDIS_HOST,
  REDIS_PORT,
  ACCESS_KEY,
  REFRESH_KEY,
};
