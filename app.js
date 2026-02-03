const express = require("express");
const connectDB = require("./database/database");

const app = express();

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const adminUserRoute = require("./routes/adminUsersRoute");
const reviewRoute = require("./routes/reviewRoute");
const myProfileRoute = require("./routes/profileRoute");

require("dotenv").config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("uploads"));

app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", adminUserRoute);
app.use("/api", reviewRoute);
app.use("/api/myProfile", myProfileRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port 3000");
});
