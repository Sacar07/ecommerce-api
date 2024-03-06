const Auth = require("../model/Auth");
const bcrypt = require("bcrypt");
const Joi = require("joi");



/* 1. client side validation
    2. server side validation
    3. database side validation
     */

const signupValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signup = async (req, res, next) => {
  /* server side validation */
  try {
    await signupValidationSchema.validateAsync(req.body, {
      allowUnknown: true, //  mathi joi ma j j required gareko cha tyo ta postman bata pathaunai paryo .required() gareko vayera tara tyo bahek aru j pani req.body ma pathaucha tyo accept garera err nafalos vanera yo gareko
      abortEarly: false, // name ra email pathako bata validation err aairaacha but if yo use garena vane name ko matra err dekhaucha email ko dekhaudaina res ma
    });
  } catch (err) {
    const errDetails = err.details.map((el) => ({
      field: el.path[0],
      msg: el.message,
    }));
    return res.status(400).send({ errDetails });
  }

  try {
    let hashed = await bcrypt.hash(req.body.password, 10);
    /* spread operator */
    let auth = await Auth.create({...req.body,password:hashed}); // obj pathako sablai req.body.name,password garna jhyau huncha so spread operator...

    res.send(auth);
  } catch (err) {
    return next(err);
  }
};


const login = async (req, res, next) => {
  try {
    let auth = await Auth.find({});
    res.send(auth);
  } catch (err) {
    return next(err);
  }
};



/* named export so same name should be used in index.js */
module.exports = {
  login,
  signup,
};
