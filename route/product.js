const express = require("express");
const router = express.Router();

const {
  fetchProducts,
  storeProducts,
  updateProducts,
  deleteProducts,
} = require("../controller/product");

const {checkAuthentication} = require("../middleware/auth")

router.get("", fetchProducts);

router.post("",checkAuthentication, storeProducts);

router.put("/:_id", updateProducts);

router.delete(":_id", deleteProducts);

module.exports = router;
