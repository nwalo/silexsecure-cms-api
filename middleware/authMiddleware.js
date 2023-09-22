require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
function verify(req, res, next) {
  // 1) Getting token and check of it's there
  let token;
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;

      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = { verify };
