const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config()

//Importing  Routes from files
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");
const paymentBRoutes = require("./routes/paymentBrainTree.js");
// const stripeRoutes = require("./routes/stripepayment.js");

//DB connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology:true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(()=>{
  console.log("DB Connected");
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBRoutes);
// app.use("/api", stripeRoutes);


//Port
const port = process.env.PORT || 8000;

//starting a server
app.listen(port, ()=>{
  console.log(`app is running at ${port}`);
})