const Order = require("../model/Order");
const Joi = require("joi");

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

    /* TODO populate price,name */


    let order = await Order.create({
      products: products,
    });
    res.send(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
};
