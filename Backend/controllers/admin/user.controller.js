const User = require("../../models/user.model");
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
