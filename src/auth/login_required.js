const clientRedis = require("../db/redis");
const jwt = require("jsonwebtoken");
const { ACCESS_KEY } = require("../settings");
const login_required = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Missing Token Error" });
  }
  jwt.verify(token, ACCESS_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        detail: {
          name: err.name,
          message: err.message,
        },
      });
    }
    const RT = await clientRedis.get(payload._id);
    if (!RT) {
      return res.status(401).json({
        status: "error",
        message: "Expired Session Error",
      });
    }
    //---//
    const firstName = payload.first_name || "";
    const lastName = payload.last_name || "";
    const CLIENT_EMAIL = payload.email;
    //---//
    req.headers.CLIENT_ID = payload._id;
    req.headers.CLIENT_NAME = `${firstName} ${lastName}`.trim();
    req.headers.CLIENT_EMAIL = CLIENT_EMAIL;
    next();
  });
};

module.exports = login_required;
