const express = require("express");
const connectDB = require("./database/database");

const app = express();

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

require("dotenv").config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use("/api", productRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port 3000");
});
