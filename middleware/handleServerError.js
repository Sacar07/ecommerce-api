module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errors = null;
  let msg = err.msg || "server error";

  if (err.name === "ValidationError") {
    msg = "Bad request/Validation error";
    statusCode = 400;
    const errArray = Object.entries(err.errors);

    // errors = [{
    //     msg:"validation error",
    //     errors: errArray.map((el) => ({
    //         field: el[0],
    //         msg: el[1].message,
    //     })),
    // }]

    errors = [];
    errArray.forEach((el) =>
      errors.push({
        field: el[0],
        msg: el[1].message,
      })
    );
  }

  res.status(statusCode).send({
    msg,
    errors,
    stack: err.stack, // kun line bata err ako dekhaucha
  });
};

/* here same like others export which is default export ya chai direct export matra gareko variable ma store nagari kina vane default ho index.js ma j nam diyeni huncha */
