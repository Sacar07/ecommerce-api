const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        default: 0, //price pathayena vane 0 res dekhaune
    },
    createdBy : {
        type: ObjectId,
        ref: "User",
        required: true,
    },
})

const Product = mongoose.model("Product", ProductSchema);

/* default export because 1 so can be named any in index.js*/
module.exports = Product;