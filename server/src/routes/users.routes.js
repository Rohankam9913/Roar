const { Router } = require("express");
const { createUser, loginUser, searchUser, updateProfile, getProfileDetails, getAllUsers, logoutUser } = require("../controllers/users.controllers");
const authMiddleware = require("../middlewares/authMiddleware");

const userRouter = Router();

// Route for creating a new user
userRouter.route("/create_user").post(createUser);

// Route for login 
userRouter.route("/login_user").post(loginUser);

// Route for searching users
userRouter.route("/search_user").get(authMiddleware, searchUser);

// Route for updating user profile
userRouter.route("/update_profile").put(authMiddleware, updateProfile);

// Route for getting profile details
userRouter.route("/user_profile/:userId").get(authMiddleware, getProfileDetails);

// Route for getting all users
userRouter.route("/get_all_users").get(authMiddleware, getAllUsers);

// Route for logout
userRouter.route("/logout_user").delete(authMiddleware, logoutUser);


module.exports = userRouter;