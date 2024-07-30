const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

router.post('/upload', validateToken, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json(err);
        }
        else if (req.file == undefined) {
            res.status(400).json({ message: "No file uploaded" });
        }
        else {
            res.json({ filename: req.file.filename });
        }
    })
});

module.exports = router;