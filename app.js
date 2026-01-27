const express = require("express");
const connectDB = require("./database/database");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

require("dotenv").config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Api is live",
  });
});

app.post("/register", async (req, res) => {
  const { email, userName, password, phoneNumber } = req.body;
  if (!email || !userName || !password || !phoneNumber) {
    return res.status(400).json({
      message: "please provide email,userName,password and phoneNumber",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (userExist) {
    return res.status(400).json({
      message: "User already exist with that email address",
    });
  }

  await User.create({
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 10),
    userName: userName,
    userPhoneNumber: phoneNumber,
  });
  res.status(201).json({
    message: "User registered successfully",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "No user found with that email address",
    });
  }
  const isPasswordMatch = bcrypt.compareSync(password, userExist.userPassword);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid credentiels",
    });
  }
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  res.status(200).json({
    message: "User loggedIn successfully",
    token,
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port 3000");
});
