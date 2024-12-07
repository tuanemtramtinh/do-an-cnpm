const Tag = require("../../models/tag.model");

module.exports.getAll = async (req, res) => {
  try {
    const resultTag = await Tag.find();
    res.status(200).json({
      status: "success",
      data: resultTag,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.createTag = async (req, res) => {
  const { name, status } = req.body;
  try {
    const newTag = new Tag({
      name,
      status,
    });
    await newTag.save();
    res.status(200).json({
      status: "success",
      data: newTag,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
