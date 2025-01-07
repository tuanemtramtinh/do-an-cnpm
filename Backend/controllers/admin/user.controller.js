const User = require("../../models/user.model");
const Comment = require("../../models/comment.model");
const messageHelper = require("../../helpers/message.helper");

module.exports.changeRole = async (req, res) => {
    try{
        const role = req.body.role;
        if(role === "admin"){   
            const id = req.params.id;
            await User.findByIdAndUpdate(id, {isAdmin: true});
            return res.status(200).json(messageHelper.returnMessage("Cập nhật quyền admin thành công", null, 200));
        }else{
            const id = req.params.id;
            await User.findByIdAndUpdate(id, {isAdmin: false});
            return res.status(200).json(messageHelper.returnMessage("Cập nhật các quyền khác thành công", null, 200));
        }
    }catch(error){ 
        console.log(error);
        res.status(500).json(messageHelper.returnMessage("Cập nhật quyền thất bại", null, 500));
    }
}

module.exports.getAllUsers = async (req, res) => {
  try {
    const role = req.user.isAdmin;
    if (role === true) {
      const users = await User.find({ _id: { $ne: req.user.id } }) 
        .select('-password') 
        .sort({ createdAt: 1, updatedAt: 1 }); 

      return res.status(200).json({
        success: true,
        data: users,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Only admins can retrieve users.",
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
    });
  }
};


module.exports.getAllComments = async (req, res) => {
    try {
      const bookId = req.params.bookId;
      const book = await Book.findById(bookId)
        .populate("comment", "comment commentor")
        .populate({
          path: "comment",
          populate: { path: "commentor", select: "name" },
        });
  
      if (!book) {
        return res.status(404).json({
          status: "fail",
          message: "Book not found",
        });
      }
  
      res.status(200).json({
        status: "success",
        data: book,
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
