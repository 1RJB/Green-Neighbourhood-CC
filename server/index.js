const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Simple Routes
app.get("/", (req, res) => {
  res.send("HOW DID U GET TO MY SUPER SECRET SPACE.");
});

app.get("/welcome", (req, res) => {
  res.send("Welcome to the Green Neighbourhood Rewards");
});

// Routes
const userRoute = require("./routes/user");
const participantRoute = require('./routes/participant');
const staffRoute = require("./routes/staff");
const adminRoute = require("./routes/admin");
const eventRoute = require('./routes/event');
const fileRoute = require('./routes/file');
const volunteerRoute = require("./routes/volunteer");
const rewardRoute = require("./routes/reward");
const redemptionRoute = require('./routes/redemption');
const pointsRoute = require('./routes/points');
const achievementRoute = require("./routes/achievement");
const staffAchievementRoute = require('./routes/staffAchievement');
const staffVolunteerRoute = require('./routes/staffvolunteer');


app.use("/user", userRoute);
app.use("/participant", participantRoute);
app.use("/staff", staffRoute);
app.use("/admin", adminRoute);
app.use("/event", eventRoute);
app.use("/file", fileRoute);
app.use("/volunteer", volunteerRoute);
app.use("/reward", rewardRoute);
app.use("/redemption", redemptionRoute); 
app.use("/points", pointsRoute);
app.use("/achievement", achievementRoute);
app.use('/staff/achievement', staffAchievementRoute);
app.use('/staffvolunteer', staffVolunteerRoute);

const db = require("./models");
const createInitialAchievements = require('./scripts/createInitialAchievements');

db.sequelize
  .sync({ alter: true })
  .then(() => {
    return createInitialAchievements();
  })
  .then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`⚡ Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
