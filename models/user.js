const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "add username"],
    },
    password: {
        type: String,
        required: [true, "add password"],
    }

})

const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;