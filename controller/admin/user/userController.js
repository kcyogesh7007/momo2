const User = require("../../../models/userModel");

exports.getUsers = async (req, res) => {
  const userId = req.user.id;
  const users = await User.find({ _id: { $ne: userId } }).select(
    "-userPassword",
  );
  if (users.length > 1) {
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } else {
    res.status(400).json({
      message: "No users found",
    });
  }
};

//delete users API

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide Id",
    });
  }
  const userFound = await User.findById(id);
  if (!userFound) {
    return res.status(400).json({
      message: "No user found with that id",
    });
  }
  await User.findByIdAndDelete(id);
  res.status(200).json({
    message: "User deleted successfully",
  });
};
