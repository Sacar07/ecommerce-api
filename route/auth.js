const express = require("express")
const router = express.Router()
const { login, signup } = require("../controller/auth");
router.get("/login", login);
router.post("/signup", signup);


module.exports = router;