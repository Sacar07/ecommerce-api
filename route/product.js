const express = require("express");
const router = express.Router();

const {
  fetchProducts,
  storeProducts,
  updateProducts,
  deleteProducts,
} = require("../controller/product");

router.get("", fetchProducts);

router.post("", storeProducts);

router.put("/:_id", updateProducts);

router.delete(":_id", deleteProducts);

module.exports = router;
