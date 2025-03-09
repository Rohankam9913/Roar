const { Schema, model } = require("mongoose");
const { hashPassword, validatePassword } = require("../utils/utility");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    minLength: 6
  },

  gender: {
    type: String,
    enum: ["Male", "Female"]
  },

  DOB: {
    type: Date,
  },

  status: {
    type: String,
    default: "Hey there, I am using Roar"
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
})

userSchema.statics.loginUser = async function (email, password) {
  const userDetails = await this.findOne({ email: email });
  if (!userDetails) {
    return null;
  }

  const isPasswordValid = await validatePassword(password, userDetails.password);
  if (!isPasswordValid) {
    return null;
  }

  return userDetails;
}

const User = model("User", userSchema);
module.exports = User;


