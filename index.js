const express = require("express");
const app = express();



const productRoutes = require("./route/product")
const userRoutes = require("./route/user")

require("./config/database") 


app.use(express.json()); // global middleware ,sets up req.body
app.use("/api/products",productRoutes)
app.use("/api/users",userRoutes) 



app.listen(8000, () => {
  console.log("server started.");
});