const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try{
    const token = req.cookies.token;

    if(!token){
      throw new Error("Unauthorized user");
    }

    jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET, (err, { userId, userName }) => {
      if (err){
        throw new Error("Session Expired");
      }

      req.user = { userId, userName };
      next();
    })
  }
  catch(error){
    res.status(401).json({ error: error.message });
  }
}

module.exports = authMiddleware;