const express = require("express")
const router = express.Router()
const { fetchUsers, storeUsers } = require("../controller/user");
router.get("", fetchUsers);
router.post("", storeUsers);


module.exports = router;