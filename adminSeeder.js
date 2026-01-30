const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

const adminSeeder = async () => {
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
};
module.exports = adminSeeder;
