const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  try {
    // Extract the Authorization header and split to get the token
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.log("No Authorization header provided");
      return res.sendStatus(401); // Unauthorized
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      console.log("No token provided");
      return res.sendStatus(401); // Unauthorized
    }

    // Verify the token using the secret key
    const payload = verify(accessToken, process.env.APP_SECRET);
    console.log("Token payload:", payload);

    // Check if the payload contains staff-related information (optional)
    if (payload.userType !== 'staff') {
      console.log("User is not a staff member");
      return res.sendStatus(403); // Forbidden
    }

    // Attach the payload to the request object
    req.staff = payload;
    return next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.log("Error verifying token:", err.message);
    return res.sendStatus(401); // Unauthorized
  }
};

module.exports = { validateToken };
