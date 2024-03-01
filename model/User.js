const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone: Number,
    password: {
        type: String,
        required: true
    },
});


const User = mongoose.model("User", UserSchema);
module.exports = User;