const md5 = require("md5");
const User = require("../../models/user.model");

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const hashedPassword = md5(password);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.json(newUser);
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
