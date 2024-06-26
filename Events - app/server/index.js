require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS before defining routes
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the GreenHood Events page");
});

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Routes
const eventRoute = require('./routes/event');
const staffRoute = require('./routes/staff');
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
app.use("/staff", staffRoute);
app.use("/event", eventRoute);
