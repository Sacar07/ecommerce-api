const jwt = require("jsonwebtoken");
const { SELLER } = require("../constant/role");
function checkAuthentication(req, res, next) {
  console.log(req.headers.authorization);
  let token = req.headers.authorization?.replaceAll("Bearer ", "");

  if (token) {
    try {
      const decodedUser = jwt.verify(token, "yourSecretSignature");
      req.user = decodedUser;
      return next(); 
    } catch (err) {  }
} 

  return res.status(401).send({
    msg: "unauthenticated",
  });
}
const isSeller = (req, res, next) => {
  if (req.user.role === SELLER) {
    return next();
  } 
  res.status(403).send({
    msg: "only for seller",
  });
};

module.exports = {
  checkAuthentication,
  isSeller
};
