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

// Simple Route
app.get("/", (req, res) => {
  res.send("HOW DID U GET TO MY SUPER SECRET SPACE.");
});

// Routes
const userRoute = require("./routes/user");
app.use("/user", userRoute);

const participantRoute = require('./routes/participant');
app.use("/participant", participantRoute);

const staffRoute = require("./routes/staff");
app.use("/staff", staffRoute);

const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

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
