const User = require("../../../models/userModel");
const bcrypt = require("bcryptjs");
exports.getMyProfile = async (req, res) => {
  const userId = req.user.id;
  const myProfile = await User.findById(userId);
  res.status(200).json({
    message: "Profile fetched successfully",
    data: myProfile,
  });
};

//update my profile

exports.updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { userName, userEmail, userPhoneNumber } = req.body;
  const updatedData = await User.findByIdAndUpdate(
    userId,
    {
      userName,
      userEmail,
      userPhoneNumber,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    message: "Profile updated successfully",
    data: updatedData,
  });
};

//delete profile

exports.deleteProfile = async (req, res) => {
  const userId = req.user.id;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "Profile deleted successfully",
  });
};

exports.updateMyPassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide oldpassword,new password and confirm password",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm password didnt matched",
    });
  }
  const oldData = await User.findById(userId);
  const hashedOldPassword = oldData.userPassword;

  const oldPasswordMatched = bcrypt.compareSync(oldPassword, hashedOldPassword);
  if (!oldPasswordMatched) {
    return res.status(400).json({
      message: "Old password didnt match",
    });
  }
  oldData.userPassword = bcrypt.hashSync(newPassword, 12);
  await oldData.save();
  res.status(200).json({
    message: "Password updated successfully",
  });
};
