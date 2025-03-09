const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const validateEmail = (email) => {
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const hashPassword = async (password) => {
  password = await hash(password, 10);
  return password;
}

const validatePassword = async (original_password, hashed_password) => {
  const isPasswordValid = await compare(original_password, hashed_password);
  return isPasswordValid;
}

const generateToken = (userId, userName) => {
  const JSON_WEB_TOKEN_SECRET = process.env.JSON_WEB_TOKEN_SECRET;
  return sign({ userId, userName }, JSON_WEB_TOKEN_SECRET, {
    expiresIn: "1d"
  });
}

module.exports = { validateEmail, hashPassword, validatePassword, generateToken }