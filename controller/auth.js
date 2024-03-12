const Auth = require("../model/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
var jwt = require("jsonwebtoken");


/* 1. client side validation
    2. server side validation
    3. database side validation
     */

const signupValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(8)
});


const signup = async (req, res, next) => {
  /* server side validation */
  try {
    await signupValidationSchema.validateAsync(req.body, {
      allowUnknown: true, //  mathi joi ma j j required gareko cha tyo ta postman bata pathaunai paryo .required() gareko vayera tara tyo bahek aru j pani req.body ma pathaucha tyo accept garera err nafalos vanera yo gareko
      abortEarly: false, // name ra email pathako bata validation err aairaacha but if yo use garena vane name ko matra err dekhaucha email ko dekhaudaina res ma
    });
  } catch (err) {
    return res.status(400).send({ 
      msg: "validation error",
      errors: err.details.map(el => {
        return{
          field: el.context.key,
          msg: el.message,
        }
      })
     });
  }
  /* email validation */
  let user = await Auth.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({
      msg: "validation error",
      errors: {
        field: "email",
        msg: "already exists"
      }
    });
  }

  try {
    let hashed = await bcrypt.hash(req.body.password, 10);
    /* spread operator */
    let user = await Auth.create({ ...req.body, password: hashed }); // obj pathako sablai req.body.name,password garna jhyau huncha so spread operator...

    user.password = undefined; //postman bata pathaune object le undef ra function lidaina tei vayera yesari password lukauna sakincha

    /* another way */
    /* user = user.toObject() //req.body ko obj is not a pure obj so to convert it to pure js object this is done
    delete user.password; // password lukako
    */


    res.send(user);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  /* server side validation */
  try {
    let user = await Auth.findOne({ email: req.body.email });

    if (user) {
      let matched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (matched) {
        user = user.toObject(); //payload error ayo vane yo garne
        user.password = undefined;
        const token = jwt.sign(user, "shhhhh");
        return res.send({token});
      } 
    } 

      res.status(401).send({
        msg: "invalid credentials"
      });
    
  } catch (err) {
    return next(err);
  }
};

/* named export so same name should be used in index.js */
module.exports = {
  login,
  signup,
};
