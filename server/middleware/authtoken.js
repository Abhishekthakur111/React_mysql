const jwt = require("jsonwebtoken");
const db = require('../models');
const secret = process.env.JWT_SECRET;
const helper = require("../helper/helper");

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, secret);
      const findUser = await db.users.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }, 
      });
      req.admin = findUser; 
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return helper.failure(res, "Invalid token", 400);
      } else if (error.name === "TokenExpiredError") {
        return helper.failure(res, "Token expired", 400);
      }
      return helper.failure(res, "Internal server error", 400);
    }
  },
};
