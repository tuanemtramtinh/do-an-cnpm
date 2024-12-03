const User = require("../models/user.model");

const isAdmin = async (req, res, next) => {
  const { userID } = req.body;
  try {
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "this user doesn' exist",
      });
    }
    if (!user.isAdmin) {
      return res.status(404).json({
        status: "fail",
        message: "this user is not an admin",
      });
    }
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "major fail",
    });
  }
};

module.exports = isAdmin;
