const express = require('express');
const router = express.Router();
const { Achievement, UserAchievements, User, sequelize } = require('../models');
const { validateToken } = require('../middlewares/staffauth');
const nodemailer = require('nodemailer');

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
        const { title, description, type, imageFile, condition } = req.body;
        const newAchievement = await Achievement.create({ title, description, type, imageFile, condition });
        res.status(201).json(newAchievement);
    } catch (error) {
        res.status(400).json({ message: 'Error creating achievement', error: error.message });
    }
});

// Update an achievement
router.put('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, imageFile, condition } = req.body;
        const [updated] = await Achievement.update({ title, description, type, imageFile, condition }, { where: { id } });
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

        // // Setup nodemailer transport
        // const transporter = nodemailer.createTransport({
        //     service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });

        // // Email options
        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: userEmail,
        //     subject: 'Congratulations! You earned a new achievement!',
        //     text: `Dear ${user.name},\n\nCongratulations! You have earned the achievement: ${achievement.title}.\n\nKeep up the great work!\n\nBest regards,\nGreen Neighbourhood Community Center Team`
        // };

        // // Send email
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending email:', error);
        //     } else {
        //         console.log('Email sent:', info.response);
        //     }
        // });

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
