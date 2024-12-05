const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.signAccessToken = (payload) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.log(err);
            reject(-1);
          }
          resolve(token);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.verifyAccessToken = (token) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(-1);
        }
        resolve(decoded);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.signRefreshToken = (payload) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports.verifyRefreshToken = (payload) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
