const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

const app = express();

const productRoutes = require("./route/product");
const authRoutes = require("./route/auth");
const handleServerError = require("./middleware/handleServerError");

require("./config/database");
const orderRoutes = require("./route/order")

app.use(express.json()); // global middleware ,sets up req.body

app.use(fileUpload()); // handles form-data , sets up(sending image)

/* serve static files */
app.use('/uploads',express.static("uploads"));


app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(handleServerError);
/* fs.writeFileSync(path.join(path.resolve(),"custom.txt"),"our text") //creating a file and writing text to it */

/* fs.unlinkSync(path.join(path.resolve(),"custom.txt")) // deleting a file */

app.listen(8000, () => {
  console.log("server started.");
});
