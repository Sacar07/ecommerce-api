const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: {
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


const Auth = mongoose.model("Auth", UserSchema);
module.exports = Auth;