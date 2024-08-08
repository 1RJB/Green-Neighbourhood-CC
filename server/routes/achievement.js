const express = require('express');
const router = express.Router();
const { User, Achievement } = require('../models');
const { validateToken } = require('../middlewares/userauth');

router.get("/", validateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Achievement,
                as: 'achievements',
                through: { attributes: [] }
            }]
        });
        res.json(user.achievements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
