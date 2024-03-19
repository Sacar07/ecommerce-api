const path = require("path");
const Product = require("../model/Product");
const Joi = require("joi");
const fs = require("fs");

const fetchProducts = async (req, res, next) => {
  try {
    let products = await Product.find({
      title: new RegExp(req.query.search, "i"), //regExp used to make req.query.search case insensitive i.e sent Guitar in query will display all titles having guitar //sorting the products a/c to price -1(descending) 1(ascending)
    }); /* .sort({ price: -1 }); */

    /* aggregation : advance find method */

    res.send(products);
  } catch (err) {
    return next(err);
  }
};

const storeProductsValidationSchema = Joi.object({
  image: Joi.object({
    size: Joi.number()
      .max(2 * 1024 * 1024)
      .messages({
        "number.max": "file must be less than 2 mb", //custom message pathako, for this we need to catch the error from joi i.e "number.max" (from documentation) and put custom message
      }),
    mimetype: Joi.string().valid(
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg",
      "image/webp"
    ),
  }),
  title: Joi.required(),
});

const storeProducts = async (req, res, next) => {
  /* reuse joi validation TODO */
  try {
    await storeProductsValidationSchema.validateAsync(
      { ...req.body, ...req.files },
      {
        allowUnknown: true, //  mathi joi ma j j required gareko cha tyo ta postman bata pathaunai paryo .required() gareko vayera tara tyo bahek aru j pani req.body ma pathaucha tyo accept garera err nafalos vanera yo gareko
        abortEarly: false, // name ra email pathako bata validation err aairaacha but if yo use garena vane name ko matra err dekhaucha email ko dekhaudaina res ma
      }
    );
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
    // console.log(req.files.image);
    let imagePath = null;

    if (req.files?.image) {
      let rootPath = path.resolve();
      let uniqueTimeStamp = Date.now() + Math.floor(Math.random() * 1000);

      imagePath = path
        .join("/", "uploads", `${uniqueTimeStamp}-${req.files.image.name}`)
        .replaceAll("\\", "/");

      req.files.image.mv(path.join(rootPath, imagePath)); // join path ma move gareko user le pathako img
    }

    let products = await Product.create({
      ...req.body,
      image: imagePath,
      createdBy: req.user._id,
    });
    res.send(products);
  } catch (err) {
    return next(err);
  }
};

const updateProducts = async (req, res) => {
  try {
    res.send(`${req.params._id} product updated`);
  } catch (err) {
    res.send(err);
  }
};

const deleteProducts = async (req, res,next) => {
  try{
    let matched = await Product.findById(req.params._id);
    if(!matched){ /* custom error thrown */
      let error = new Error();
      error.statusCode = 404; //this is stored in err
      error.msg = "Not found"; // stored in err
      throw error;
    }
  
    let product = await Product.findByIdAndDelete(req.params._id);
    fs.unlinkSync(path.join(path.resolve(), product.image)); // deleting a file (image)
    res.send("Product deleted");
  }
  catch(err){
    next(err);
  }
};

/* named export because of 2 */
module.exports = {
  fetchProducts: fetchProducts,
  storeProducts,
  updateProducts,
  deleteProducts,
};
