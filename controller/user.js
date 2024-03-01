const User = require("../model/User");

const fetchUsers = async (req, res) => {
  try {
    let users = await User.find({});
    res.send(users);
  } catch (err) {
    res.send(err);
  }
};

const storeUsers = async (req, res) => {
  try {
    let { userName, email, phone, password } = req.body;
    let users = await User.create({ userName, email, phone, password });
    res.send(users);
  } catch (err) {
    res.status(400).send(err.name);
  }
};

/* named export so same name should be used in index.js */
module.exports = {
  fetchUsers,
  storeUsers,
};
