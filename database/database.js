const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");

    const isAdminExist = await User.findOne({ userEmail: "admin@gmail.com" });
    if (!isAdminExist) {
      await User.create({
        userEmail: "admin@gmail.com",
        userPassword: bcrypt.hashSync("admin", 10),
        userName: "admin",
        userPhoneNumber: "9845394521",
        role: "admin",
      });
      console.log("Admin seeded successfully");
    } else {
      console.log("Admin already seeded");
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
