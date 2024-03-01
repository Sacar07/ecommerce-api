const User = require("../model/User");
const bcrypt = require("bcrypt");

const fetchUsers = async (req, res, next) => {
  try {
    let users = await User.find({});
    res.send(users);
  } catch (err) {
    return next(err);
  }
};

const storeUsers = async (req, res, next) => {
  try {
    let { userName, email, phone, password } = req.body;
    let users = await User.create({ userName, email, phone, password });
    res.send(users);
  } catch (err) {
    return next(err);
  }
};

/* named export so same name should be used in index.js */
module.exports = {
  fetchUsers,
  storeUsers,
};
