const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../../models/user.model");
const Comment = require("../../models/comment.model");
const Book = require("../../models/book.model");
const messageHelper = require("../../helpers/message.helper");
const { signAccessToken } = require("../../helpers/jwt.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const { generateOTP } = require("../../helpers/generate.helper");
const { sendMail } = require("../../helpers/mail.helper");

module.exports.register = async (req, res) => {
  try {
    const { email, username, password, phone, dob } = req.body;

    const existUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existUser) {
      res
        .status(500)
        .json(messageHelper.returnMessage("Người dùng đã tồn tại", null, 500));

      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const dobDate = new Date(dob);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      dob: dobDate,
      phone,
      avatar: `https://ui-avatars.com/api/?name=${username}`,
    });

    await newUser.save();

    const data = { id: newUser.id };

    const token = await signAccessToken(data);

    if (token === -1) {
      const message = messageHelper.returnMessage(
        "Có lỗi server, vui lòng thử lại",
        null,
        500
      );
      res.status(500).json(message);
      return;
    }

    const message = messageHelper.returnMessage(
      "Tạo tài khoản thành công",
      { token },
      200
    );

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existUser = await User.findOne({
      username,
    });

    if (!existUser) {
      const message = messageHelper.returnMessage(
        "Người dùng không tồn tại",
        null,
        400
      );

      res.status(400).json(message);
      return;
    }

    if (!bcrypt.compareSync(password, existUser.password)) {
      const message = messageHelper.returnMessage(
        "Mật khẩu không đúng",
        null,
        400
      );
      res.status(400).json(message);
      return;
    }

    const data = {
      id: existUser.id,
    };

    const token = await signAccessToken(data);

    if (token === -1) {
      const message = messageHelper.returnMessage(
        "Có lỗi server, vui lòng thử lại",
        null,
        500
      );
      res.status(500).json(message);
      return;
    }

    const message = messageHelper.returnMessage(
      "Đăng nhập thành công",
      {
        token,
      },
      200
    );

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports.info = async (req, res) => {
  try {
    const dob = req.user.dob.toISOString().split("T")[0];
    const role = req.user.isAdmin ? "Admin" : "Uploader";
    const createdAt = req.user.createdAt.toISOString().split("T")[0];
    
    const returnUser = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      phone: req.user.phone,
      isAdmin: req.user.isAdmin,
      dob: dob,
      avatar: req.user.avatar,
      role: role,
      createdAt: createdAt,
    };

    res.json(
      messageHelper.returnMessage(
        "Lấy thông tin người dùng thành công",
        returnUser,
        200
      )
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports.forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = generateOTP(6);

    if (!email) {
      const message = messageHelper.returnMessage(
        "Vui lòng nhập vào email",
        null,
        400
      );
      res.status(400).json(message);
      return;
    }

    //Tạo mã OTP

    const existOTP = await ForgotPassword.findOne({
      emai: email,
    });

    let forgotPasswordUser;

    if (!existOTP) {
      forgotPasswordUser = new ForgotPassword({
        email,
        otp,
        expireAt: Date.now() + 5 * 60 * 1000,
      });

      await forgotPasswordUser.save();
    } else {
      forgotPasswordUser = existOTP;
    }

    //Gửi email

    const content = `Mã OTP của bạn là <b>${forgotPasswordUser.otp}</b>. Xin đừng chia sẻ với ai, chia sẻ là cook :). Token sẽ hết hạn sau <b>5 phút</b>`;

    sendMail(email, content);

    const message = messageHelper.returnMessage(
      "Lấy mã OTP thành công",
      {
        otp: forgotPasswordUser.otp,
      },
      200
    );

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendOTP = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    console.log(otp);

    const existOTP = await ForgotPassword.findOne({
      otp,
    });

    if (!existOTP) {
      const message = messageHelper.returnMessage(
        "OTP không hợp lệ, vui lòng thử lại",
        null,
        400
      );
      res.status(400).json(message);
      return;
    }

    const existUser = await User.findOne({
      email: email,
    });

    if (!existUser) {
      const message = messageHelper.returnMessage(
        "Người dùng không tồn tại, vui lòng thử lại",
        null,
        400
      );
      res.status.json(message);
      return;
    }

    const data = { id: existUser.id };

    const token = await signAccessToken(data);

    if (token === -1) {
      const message = messageHelper.eturnMessage(
        "Có lỗi server, vui lòng thử lại",
        null,
        500
      );
      res.status(500).json(message);
      return;
    }

    const message = messageHelper.returnMessage(
      "Xác thực người dùng thành coong",
      {
        token,
      },
      200
    );

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const newPassword = req.body.password;

    const existUser = await User.findById(req.user.id);

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        password: hashedPassword,
      }
    );

    const message = messageHelper.returnMessage(
      "Cập nhật mật khẩu thành công",
      null,
      200
    );

    res.json(message);
  } catch (error) {
    console.log(error);
  }
};
module.exports.createComment = async (req, res) => {
  const { bookId, comment } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }

    const newComment = new Comment({
      comment,
      commentor: req.user._id,
      bookid: bookId,
    });

    await newComment.save();

    book.comment.push(newComment._id);
    await book.save();

    res.status(200).json({
      status: "success",
      data: newComment,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
