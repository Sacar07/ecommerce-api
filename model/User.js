const { string } = require("joi");
const mongoose = require("mongoose");
const { BUYER, SELLER } = require("../constant/role");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address:{
        street: String,
        ward: Number,
    },
    email:{
        type: String,
        required: true,
        /* custom mongoose validation -- check email here */
        validate:{
            validator: async (value) => {
                let matched = await mongoose.models.User.findOne({email:value});//we are using User model before declaring it (which is declared below) so we are doing mongoose.models

                //if email and value(req.body.email) matches ...user will be stored in matched which is truthy value
                if(matched){
                return false;
                }
            },
            
                message: "email already exists"
            }
        }
    ,
    phone: Number,
    password: {
        type: String,
        required: true,
        select: false, // find garda password lukaidine /* yesle garda sabbai find ma password aaudaina ra login ma error falcha */
    },
    role:{
        type: String,
        enum: [BUYER,SELLER],
        required: true,
        set: (value) => {
            console.log(value);
            return value.toLowerCase()
        }
    },
});


const User = mongoose.model("User", UserSchema);
module.exports = User;