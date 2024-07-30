const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the Green Neighbourhood Rewards");
});

// Routes
const rewardRoute = require('./routes/reward');
const staffRoute = require('./routes/staff');
const customerRoute = require('./routes/customer');
const fileRoute = require('./routes/file');
const pointsRouter = require('./routes/points');

app.use("/reward", rewardRoute);
app.use("/staff", staffRoute);
app.use("/customer", customerRoute);
app.use("/file", fileRoute);
app.use("/points", pointsRouter);

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
