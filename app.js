const express = require("express");
const connectDB = require("./database/database");

const app = express();

const authRoute = require("./routes/authRoutes");

require("dotenv").config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("", authRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port 3000");
});
