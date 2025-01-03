const { verifyAccessToken } = require("../helpers/jwt.helper");
const { returnMessage } = require("../helpers/message.helper");
const User = require("../models/user.model");

module.exports.checkRole = async (req, res, next) => {
  try {
    console.log(req.user);
    console.log(req.user.isAdmin);
    let role = req.user.isAdmin;
    console.log(typeof(role));

    if (role === true) {  
      console.log("User is an admin");
      next();  
    } else {
      console.log("User is not an admin");
      return res.status(404).json({
        status: "fail",
        message: "Access denied: Admins only"
    });  
    }
  } catch (error) {
    console.log(error);
  }
};
