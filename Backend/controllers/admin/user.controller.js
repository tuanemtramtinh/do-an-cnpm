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
        const role = req.body.role;

        if (role === "admin") {
            const users = await User.find(); 
            return res.status(200).json({
                success: true,
                data: users
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access. Only admins can retrieve users."
            });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users."
        });
    }
};

module.exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate("commentor", "name"); 
        res.status(200).json({
        status: "success",
        data: comments,
        });
    } catch (err) {
        res.status(400).json({
        status: "fail",
        message: err.message,
        });
    }
};
