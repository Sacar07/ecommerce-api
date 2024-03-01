const Product = require("../model/Product");

const fetchProducts = async (req, res) => {
  try {
    let products = await Product.find({}).populate("createdBy");
    res.send(products);
  } catch (err) {
    res.send(err);
  }
};

const storeProducts = async (req, res) => {
  try {
    let { title, price, createdBy } = req.body;
    let products = await Product.create({ title, price, createdBy });
    res.send(products);
  } catch (err) {
    res.status(400).send(err.name);
  }
};

const updateProducts = async (req, res) => {
  try {
    res.send(`${req.params._id} product updated`);
  } catch (err) {
    res.send(err);
  }
};

const deleteProducts = async (req, res) => {
  try {
    res.send(`Product deleted`);
  } catch (err) {
    res.send(err);
  }
};

/* named export because of 2 */
module.exports = {
  fetchProducts: fetchProducts,
  storeProducts,
  updateProducts,
  deleteProducts,
};