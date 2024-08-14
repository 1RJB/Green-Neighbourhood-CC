const express = require('express');
const router = express.Router();
const { Achievement, UserAchievements, User, sequelize } = require('../models');
const { validateToken } = require('../middlewares/staffauth');
const yup = require("yup");

// Common validation schema
let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    condition: yup.string().trim().min(3).max(100).required(),
    imageFile: yup.string().trim().min(3).max(100).required(),
});

// Get all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.findAll();
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching achievements', error: error.message });
    }
});

// Create an achievement
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    if (req.staff) {
        data.staffId = req.staff.id;
    } else {
        return res.sendStatus(401);
    }

    try {
        let result = await Achievement.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Update an achievement
router.put('/:id', validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let achievement = await Achievement.findByPk(id);
    if (!achievement) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    if (req.staff) {
        data.staffId = req.staff.id;
    } else {
        return res.sendStatus(401);
    }

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data
        let num = await Achievement.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Achievement was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update achievement with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
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

// Award an achievement to a user
router.post('/award', validateToken, async (req, res) => {
    try {
        const { userEmail, achievementId, conditionChecked } = req.body;

        // Validate input
        if (!userEmail || !achievementId || !conditionChecked) {
            return res.status(400).json({ message: 'User email, achievement, and checked condition are required' });
        }

        // Check if user exists
        const user = await User.findOne({ where: { email: userEmail } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if achievement exists
        const achievement = await Achievement.findByPk(achievementId);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Check if user has already earned this achievement
        const existingAchievement = await UserAchievements.findOne({
            where: {
                userId: user.id,
                achievementId: achievement.id
            }
        });
        if (existingAchievement) {
            return res.status(400).json({ message: 'User has already earned this achievement' });
        }

        // Create a new user achievement
        const newUserAchievement = await UserAchievements.create({
            userId: user.id,
            achievementId,
            notice: conditionChecked ? 1 : 0 // Set condition based on checkbox
        });

        res.status(201).json(newUserAchievement);
    } catch (error) {
        console.error("Error awarding achievement:", error);
        res.status(500).json({ message: 'Error awarding achievement', error: error.message });
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
