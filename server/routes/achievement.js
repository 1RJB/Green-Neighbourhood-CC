const express = require('express');
const router = express.Router();
const { User, Achievement } = require('../models');
const { validateToken } = require('../middlewares/userauth');

// Get all achievements
router.get("/all", async (req, res) => {
    try {
        const achievements = await Achievement.findAll();
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's earned achievements
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

// Get achievement stats
router.get("/stats", async (req, res) => {
    try {
        const achievements = await Achievement.findAll({
            include: [{
                model: User,
                as: 'users',
                attributes: ['id']
            }]
        });

        const totalUsers = await User.count();
        const stats = achievements.map(achievement => {
            const earnedCount = achievement.users.length;
            const percentage = totalUsers > 0 ? (earnedCount / totalUsers) * 100 : 0;

            return {
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                percentage: Math.round(percentage)
            };
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
