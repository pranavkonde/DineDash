const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./database/index");
const userRouter = require("./routers/user");
const restaurantRouter = require("./routers/restaurants");
const paymentRouter= require("./routers/payment")
const cartRouter = require("./routers/cart")

var app = express();

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:1234",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

db.init();

app.use("/user", userRouter)
app.use("/restaurants", restaurantRouter)
app.use("/",paymentRouter)
app.use('/cart', cartRouter);

app.listen(process.env.PORT, function () {
  console.log(`server is runing on port ${process.env.PORT}`);
});