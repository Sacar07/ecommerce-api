module.exports = (err, req, res, next) => {
  let statusCode = 500;
  let error = err.name;
  let msg = "server error"

  if (err.name === "ValidationError"){
    msg = "Bad request/Validation error"
    statusCode = 400;
    error = {
        email: "already exists",
        password: "required field",
    }
}

res.status(statusCode).send({
    msg,
    error,
    stack: err.stack // kun line bata err ako dekhaucha
});
    
};

/* here same like others export which is default export ya chai direct export matra gareko variable ma store nagari kina vane default ho index.js ma j nam diyeni huncha */
