const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
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
};

exports.loginUser = async (req, res) => {
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
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email doesnot exist",
    });
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  await sendEmail({
    email,
    subject: "Your OTP for DigitalMomo",
    message: `Your One time password for DigtalMomo is ${otp}. Don't share with anyone.`,
  });
  userExist.otp = otp;
  await userExist.save();
  res.status(200).json({
    message: "Otp email sent successfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide otp and email",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email doesnot exist",
    });
  }
  if (userExist.otp !== otp) {
    return res.status(400).json({
      message: "Incorrect otp",
    });
  }
  userExist.isOtpVerified = true;
  userExist.otp = undefined;
  await userExist.save();
  res.status(200).json({
    message: "Otp verified successfully",
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email,new Password and confirm Password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email doesnot exist",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm password doesnot match",
    });
  }
  if (!userExist.isOtpVerified) {
    return res.status(400).json({
      message: "You cannot perform this action",
    });
  }
  userExist.userPassword = bcrypt.hashSync(newPassword, 10);
  userExist.isOtpVerified = false;
  await userExist.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
};
