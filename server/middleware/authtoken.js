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
        return helper.error(res, "Invalid token", 403);
      } else if (error.name === "TokenExpiredError") {
        return helper.error(res, "Token expired", 403);
      }
      return helper.error(res, "Internal server error", 500);
    }
  },
};
