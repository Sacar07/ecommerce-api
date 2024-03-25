const Order = require("../model/Order");
const Joi = require("joi");
const Product = require("../model/Product");

const storeOrderValidationSchema = Joi.object({
  products: Joi.array()
    .items({
      _id: Joi.required(),
      quantity: Joi.number().min(1).required(),
    })
    .min(1)
    .required(),
});

const createOrder = async (req, res, next) => {
  /* server side validation */
  try {
    await storeOrderValidationSchema.validateAsync(req.body, {
      allowUnknown: true, //  mathi joi ma j j required gareko cha tyo ta postman bata pathaunai paryo .required() gareko vayera tara tyo bahek aru j pani req.body ma pathaucha tyo accept garera err nafalos vanera yo gareko
      abortEarly: false, // name ra email pathako bata validation err aairaacha but if yo use garena vane name ko matra err dekhaucha email ko dekhaudaina res ma
    });
  } catch (err) {
    return res.status(400).send({
      msg: "validation error",
      errors: err.details.map((el) => {
        return {
          field: el.context.key,
          msg: el.message,
        };
      }),
    });
  }
  try {
    /* req.body.products */
    let products = [];

    /* validation for quantity check */

    /* forEach use garda async await use gareni as a whole function asynchronous nai huncha tei vayera products array ma empty res aucha, find ra push bich chai await huncha but whole function will be asynchroous. so to tackle this org for loop is used ***FOREACH CANT BE BLOCKED***/

    for (let index = 0; index < req.body.products.length; index++) {
      // req.body.products.forEach(async (el) => {
      let el = req.body.products[index];
      let dbProduct = await Product.findById(el._id);
      // console.log(dbProduct);
      products.push({
        _id: el._id, //req.body ma cha so el but dbProduct garda ni huncha
        title: dbProduct.title,
        rate: dbProduct.price,
        quantity: el.quantity,
      });
    }

    let order = await Order.create({
      products: products,
    });

    /* updating quantity of product according to the order */
    /*this can also be done in mongoose post save hook i.e in model -> schema  
    let orderProducts = order.products;
    orderProducts.forEach(async (el) => {
     await Product.findByIdAndUpdate(el._id,{
        $inc: { inStock: -el.quantity}
      });
    }) */

    res.send(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
};
