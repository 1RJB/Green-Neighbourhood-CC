// redemption.js
const express = require('express');
const router = express.Router();
const { User, Reward, Redemption, Achievement, UserAchievement } = require('../models');
const { Sequelize, Op, fn, col, where } = require("sequelize");
const yup = require("yup");
const dayjs = require('dayjs');
const { validateToken: validateStaffToken } = require('../middlewares/staffauth');
const { validateToken: validateUserToken } = require('../middlewares/userauth');

// GET: List redemptions with optional userName and rewardTitle filtering, and sorted
router.get("/", async (req, res) => {
    let { rewardTitle, userName, sortBy, order, status } = req.query;

    console.log('Query Params:', { rewardTitle, userName, sortBy, order, status });

    // Define sort attribute for Sequelize query
    let sortAttribute;
    if (sortBy === 'userName') {
        sortAttribute = Sequelize.literal("CONCAT(`user`.`firstName`, ' ', `user`.`lastName`)");
    } else if (sortBy === 'rewardTitle') {
        sortAttribute = Sequelize.literal("`reward`.`title`");
    } else {
        sortAttribute = sortBy || 'redeemedAt';
    }

    try {
        const redemptions = await Redemption.findAll({
            order: [[sortAttribute, order || 'DESC']],
            where: status && status !== 'All' ? { status } : {},
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    where: userName ? {
                        [Op.or]: [
                            where(fn('concat', col('firstName'), ' ', col('lastName')), {
                                [Op.like]: `%${userName}%`
                            }),
                            { firstName: { [Op.like]: `%${userName}%` } },
                            { lastName: { [Op.like]: `%${userName}%` } }
                        ]
                    } : {}
                },
                {
                    model: Reward,
                    as: 'reward',
                    attributes: ['id', 'title'],
                    where: rewardTitle ? {
                        title: { [Op.like]: `%${rewardTitle}%` }
                    } : {}
                }
            ],
        });

        // Convert Sequelize instances to plain objects
        const redemptionsPlain = redemptions.map(redemption => redemption.get({ plain: true }));

        console.log('Redemptions fetched:', JSON.stringify(redemptionsPlain, null, 2));

        res.json(redemptionsPlain);
    } catch (error) {
        console.error('Error fetching redemptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET: Retrieve a specific redemption by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const redemption = await Redemption.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstname', 'lastname', 'email']
                },
                {
                    model: Reward,
                    as: 'reward',
                    attributes: ['id', 'title']
                }
            ]
        });

        if (!redemption) {
            return res.sendStatus(404);
        }

        res.json(redemption);
    } catch (error) {
        console.error('Error retrieving redemption:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// PUT: Update a specific redemption
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { collectBy, status } = req.body;

    try {
        // Find the redemption by ID
        const redemption = await Redemption.findByPk(id);
        if (!redemption) {
            return res.status(404).json({ error: 'Redemption not found' });
        }

        // Store the old status before updating
        const oldStatus = redemption.status;

        // Update the redemption fields
        redemption.collectBy = collectBy ? dayjs(collectBy).toISOString() : null;
        redemption.status = status;

        await redemption.save();

        // Check if the status has changed to "Collected" and was not already "Collected"
        const achievementEarned = status === "Collected" && oldStatus !== "Collected";

        // Fetch the user associated with the redemption
        const user = await User.findByPk(redemption.userId);

        if (achievementEarned) {

            // Award points to the user
            user.points += 5000;
            await user.save();

            // Check for first reward redemption achievement
            const userAchievements = await User.findByPk(redemption.userId, {
                include: [{
                    model: Achievement,
                    as: 'achievements'
                }]
            });

            // If the user hasn't earned the "first_redemption_collected" achievement, add it
            if (!userAchievements.achievements.some(a => a.type === 'first_redemption_collected')) {
                const firstRedemptionCollectedAchievement = await Achievement.findOne({ where: { type: 'first_redemption_collected' } });
                if (firstRedemptionCollectedAchievement) {
                    await userAchievements.addAchievement(firstRedemptionCollectedAchievement);

                    // Update the notice field in userachievements table
                    await UserAchievement.update(
                        { notice: 1 },
                        { where: { userId: redemption.userId, achievementId: firstRedemptionCollectedAchievement.id } }
                    );
                }
            }

            console.log(`User points updated to ${user.points}`);
        } else {
            console.log(`No points update needed. Old status: ${oldStatus}, New status: ${status}`);
        }

        res.json({
            message: "Redemption was updated successfully.",
            achievementEarned, // Include this line to indicate if an achievement was earned
            userlastName: user.lastName,
            useremail: user.email
        });
    } catch (error) {
        console.error('Error updating redemption:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST: Create a new redemption
router.post('/redeem/:rewardId', validateUserToken, async (req, res) => {
    let rewardId = req.params.rewardId;
    let userId = req.user.id;

    try {
        // Find the reward and user
        let reward = await Reward.findByPk(rewardId);
        let user = await User.findByPk(userId);

        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has enough points
        if (user.points < reward.points) {
            return res.status(400).json({ error: 'Not enough points to redeem the reward' });
        }

        // Check if the user has already redeemed this reward too many times
        let userRedemptionCount = await Redemption.count({
            where: {
                rewardId: rewardId,
                userId: userId
            }
        });

        if (reward.maxEachRedeem !== null && userRedemptionCount >= reward.maxEachRedeem) {
            return res.status(400).json({ error: 'You have already redeemed this reward the maximum allowed number of times.' });
        }

        // Check if the total number of redemptions has reached the limit
        let totalRedemptionCount = await Redemption.count({
            where: {
                rewardId: rewardId
            }
        });

        if (reward.maxTotalRedeem !== null && totalRedemptionCount >= reward.maxTotalRedeem) {
            return res.status(400).json({ error: 'This reward has already been redeemed the maximum allowed number of times.' });
        }

        // Reduce user points
        user.points -= reward.points;
        await user.save();

        // Create redemption record
        let redemption = await Redemption.create({
            userId: user.id,
            rewardId: reward.id,
            redeemedAt: new Date()
        });

        // Check for first redemption achievement
        const userAchievements = await user.getAchievements();
        if (!userAchievements.some(a => a.type === 'first_redemption')) {
            const firstRedemptionAchievement = await Achievement.findOne({ where: { type: 'first_redemption' } });
            if (firstRedemptionAchievement) {
                await user.addAchievement(firstRedemptionAchievement);
            }
        }

        // Fetch the updated user data to return
        let updatedUser = await User.findByPk(userId, {
            include: [{
                model: Achievement,
                as: 'achievements',
                through: { attributes: [] }
            }]
        });

        res.json({
            message: 'Reward redeemed successfully',
            redemption,
            user: updatedUser,
            newAchievement: !userAchievements.some(a => a.type === 'first_redemption')
        });

    } catch (error) {
        console.error('Error redeeming reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
