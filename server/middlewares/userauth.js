const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").split(" ")[1];
    if (!accessToken) {
      return res.sendStatus(401); // Unauthorized
    }
    
    // Verify the token using the secret from environment variables
    const payload = verify(accessToken, process.env.APP_SECRET);

    // Set the payload (user data) in req.user
    req.user = payload;
    return next();
  } catch (err) {
    return res.sendStatus(401); // Unauthorized
  }
};

module.exports = { validateToken };
