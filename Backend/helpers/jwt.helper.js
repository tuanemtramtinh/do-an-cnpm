const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.signAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("Lỗi khi kí token", err.message);
          resolve(-1);
        }
        resolve(token); 
      }
    );
  });
};

module.exports.verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        resolve(-1); 
      }
      resolve(decoded);
    });
  });
};

// module.exports.signRefreshToken = (payload) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports.verifyRefreshToken = (payload) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };
