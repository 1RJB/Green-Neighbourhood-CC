const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Simple Route
app.get("/", (req, res) => {
  res.send("HOW DID U GET TO MY SUPER SECRET SPACE.");
});

// Routes
const userRoute = require("./routes/user");
app.use("/user", userRoute);

const staffRoute = require("./routes/staff");
app.use("/staff", staffRoute);


const db = require("./models");
db.sequelize
  .sync({ alter: true })
  .then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`Sever running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });