const Chat = require("../models/chats.models");
const User = require("../models/users.models");
const { validateEmail, generateToken } = require("../utils/utility");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // checking if all the details are sent or not.
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing Details" });
    }

    // Checking if the email provided is valid or not.
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email id" });
    }

    // Checking if the password provided is atleast 6 characters long or not.
    if (password.length < 6) {
      return res.status(400).json({ error: "Password provided must be atleast 6 characters long" });
    }

    const newUser = new User({ username: username, email: email, password: password });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.username);
    res.cookie("token", token, {
      maxAge: "86400000",
      httpOnly: true
    });

    return res.status(201).json({ _id: newUser._id, username: newUser.username, email: newUser.email });
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while creating user" });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if all the details are provided or not
    if (!email || !password) {
      return res.status(400).json({ error: "Missing Details" });
    }

    // Checking user credentials
    const user = await User.loginUser(email, password);
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    const token = generateToken(user._id, user.username);
    res.cookie("token", token, {
      maxAge: "86400000",
      httpOnly: true
    });

    return res.status(200).json({ _id: user._id, username: user.username, email: user.email });
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while log in" });
  }
}

const searchUser = async (req, res) => {
  try {
    const { search_query } = req.query;

    const users = await User.find({ _id: { $ne: req.user.userId } }).find({ "username": { "$regex": search_query, "$options": "i" } }).select("-password");
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    return res.status(200).json(users);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while searching user" });
  }
}

const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const userDetails = await User.findById({ _id: userId }).select("-password");

    if (!userDetails) {
      return res.status(400).json({ error: "No details found" });
    }

    return res.status(200).json(userDetails);

  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while fetching user profile" });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { _id, DOB, status, username } = req.body;

    let body = {};
    if (DOB) body["DOB"] = DOB;
    if (status) body["status"] = status;
    if (username) body["username"] = username

    const userDetails = await User.findByIdAndUpdate({ _id }, { username: body.username, DOB: body.DOB, status: body.status }, { new: true }).select("-password");
    return res.status(200).json(userDetails);
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error happened while updating the profile" });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select("-password");
    return res.status(200).json(users);
  }
  catch (error) {
    console.log(error.messsage);
    return res.status(500).json({ error: "Error happened while getting the users" });
  }
}

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true
    });

    return res.status(200).json({ msg: "Logged Out Successfully" });
  }
  catch (error) {
    console.log(error.messsage);
    return res.status(500).json({ error: "Error happened while logout" });
  }
}

module.exports = { createUser, loginUser, searchUser, getProfileDetails, updateProfile, getAllUsers, logoutUser };