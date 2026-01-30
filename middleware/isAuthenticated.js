const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({
      message: "Please login",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  const userExist = await User.findById(decoded.id);
  if (!userExist) {
    return res.status(403).json({
      message: "User doesnot exit with that token",
    });
  }
  req.user = userExist;
  next();
};

module.exports = isAuthenticated;
