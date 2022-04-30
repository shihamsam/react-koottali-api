const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require("./routes/posts");


dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(
  () => {
    console.log("Mongo DB connection succeeded..");
  },
  () => {
    console.log("Connection failed!");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Home page!");
});
 

app.listen(8800, () => {
  console.log("listening at port 8800...");
});
