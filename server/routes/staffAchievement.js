const express = require('express');
const router = express.Router();
const { Achievement, UserAchievements, sequelize } = require('../models');
const { validateToken } = require('../middlewares/staffauth');

// Get all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.findAll();
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching achievements', error: error.message });
    }
});

// Create a new achievement
router.post('/', validateToken, async (req, res) => {
    try {
        const { title, description, type, imageFile } = req.body;
        const newAchievement = await Achievement.create({ title, description, type, imageFile });
        res.status(201).json(newAchievement);
    } catch (error) {
        res.status(400).json({ message: 'Error creating achievement', error: error.message });
    }
});

// Update an achievement
router.put('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, imageFile } = req.body;
        const [updated] = await Achievement.update({ title, description, type, imageFile }, { where: { id } });
        if (updated) {
            const updatedAchievement = await Achievement.findByPk(id);
            res.json(updatedAchievement);
        } else {
            res.status(404).json({ message: 'Achievement not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating achievement', error: error.message });
    }
});

// Delete an achievement
router.delete('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Achievement.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: 'Achievement deleted' });
        } else {
            res.status(404).json({ message: 'Achievement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting achievement', error: error.message });
    }
});

// Count total number of achievements earned by all users
router.get('/totalcount', async (req, res) => {
    try {
        const totalAchievements = await UserAchievements.count();
        res.json({ totalAchievements });
    } catch (error) {
        res.status(500).json({ message: 'Error counting total achievements', error: error.message });
    }
});

// Count earned achievements per achievement
router.get('/counts', async (req, res) => {
    try {
        const counts = await UserAchievements.findAll({
            attributes: ['achievementId', [sequelize.fn('COUNT', sequelize.col('achievementId')), 'count']],
            group: 'achievementId',
            raw: true
        });

        // Format the counts as an object where keys are achievement IDs
        const countsObject = counts.reduce((acc, curr) => {
            acc[curr.achievementId] = parseInt(curr.count, 10);
            return acc;
        }, {});

        res.json(countsObject);
    } catch (error) {
        console.error("Error counting earned achievements:", error);
        res.status(500).json({ message: 'Error counting earned achievements', error: error.message });
    }
});

module.exports = router;
