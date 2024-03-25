const path = require("path");
const Product = require("../model/Product");
const Joi = require("joi");
const fs = require("fs");

const fetchProducts = async (req, res, next) => {
  try {
    let sort = req.query.sort || "dataDesc";
    let priceFrom = parseFloat(req.query.priceFrom) || 0;
    let priceTo = parseFloat(req.query.priceTo) || 9999999999999999; //parseFloat converts everything to numerical value so if string its parsed to nAn which is falsy value
    let perPage = parseInt(req.query.perPage) || 5;
    let page = parseInt(req.query.page) || 1;

    let sortBy = {
      createdAt: -1,
    };

    if (sort == "priceAsc") {
      sortBy = { price: 1 };
    } else if (sort == "priceDesc") {
      sortBy = { price: -1 };
    } else if (sort == "titleAsc") {
      sortBy = { title: 1 };
    } else if (sort == "titleDesc") {
      sortBy = { price: -1 };
    }

    let productFilter = {
      title: new RegExp(req.query.sort, "i"), //regExp used to make req.query.sort through i, case insensitive i.e sent Guitar in query will display all titles having guitar //sorting the products a/c to price -1(descending) 1(ascending)
      $and: [{ price: { $gte: priceFrom } }, { price: { $lte: priceTo } }], // query operator for range filtering
    };

    let products = await Product.find(productFilter)
      .sort(sortBy)
      .skip((page - 1) * perPage) //kati ota products exclude garne from beginning
      .limit(perPage)
      .populate("createdBy"); //kati ota products display garne

    let totalProducts = await Product.countDocuments(productFilter);
    //  totalProducts = totalProducts.length;


    /* aggregation : advance find method */
    productss = await Product.aggregate([
      {
        $match: {
          title: new RegExp(req.query.sort, "i"),
        },
      },
      {
        $match: {
          $and: [{ price: { $gte: priceFrom } }, { price: { $lte: priceTo } }],
        },
      },
      {
        /* populate in agg  */
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: "$createdBy",
      },
      {
        $project: {
          "createdBy.name": 1,
          "createdBy.email": 1,
        },
      },
      {
        $skip:(page - 1) * perPage
      },
      { 
        $limit : perPage
      },
      {
        $facet //to count
      }
    ]);

    res.send({
      page: page,
      perPage,
      total: totalProducts,
      data: products,
    });
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

const deleteProducts = async (req, res, next) => {
  try {
    let matched = await Product.findById(req.params._id);
    if (!matched) {
      /* custom error thrown */
      let error = new Error();
      error.statusCode = 404; //this is stored in err
      error.msg = "Not found"; // stored in err
      throw error;
    }

    let product = await Product.findByIdAndDelete(req.params._id);
    fs.unlink(path.join(path.resolve(), product.image), (err, data) => {
      console.log(err); //can also be done through post hooks
    }); // deleting a file (image)
    res.send("Product deleted");
  } catch (err) {
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
