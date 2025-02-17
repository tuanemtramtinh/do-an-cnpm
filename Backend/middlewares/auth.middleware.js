const { verifyAccessToken } = require("../helpers/jwt.helper");
const { returnMessage } = require("../helpers/message.helper");
const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      const message = returnMessage("Vui lòng cung cấp token", null, 400);
      res.status(400).json(message);
      return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = await verifyAccessToken(token);

    if (decodedToken === -1) {
      const message = returnMessage(
        "Token hết hạn, vui lòng đăng nhập lại",
        null,
        500
      );
      res.status(500).json(message);
      return;
    }

    const existUser = await User.findOne({
      _id: decodedToken.id,
    });

    if (!existUser) {
      const message = returnMessage(
        "Token không hợp lệ, vui lòng gửi lại token mới",
        null,
        400
      );
      res.status(400).json(message);
      return;
    }

    req.user = existUser;
    req.commentorId = existUser._id;
    // console.log(req.commentorId);
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
  }
};
