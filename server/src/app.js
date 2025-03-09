require("dotenv").config();
const express = require('express');
const userRouter = require("./routes/users.routes");
const chatRouter = require("./routes/chat.routes");
const messageRouter = require("./routes/messages.routes");
const cookieParser = require("cookie-parser");
const app = express();

// CORS middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
})

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

module.exports = app;