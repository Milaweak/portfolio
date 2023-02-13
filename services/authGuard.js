const UserModel = require("../models/user")

let authGuard = async(req, res, next)=>{
    const user = await UserModel.findOne({_id: req.session.userId})
    if (user) {
        next()
    }else{
        res.redirect('/')
    }
}

module.exports = authGuard