// redemption.js
const express = require('express');
const router = express.Router();
const { User, Reward, Redemption } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken: validateStaffToken } = require('../middlewares/staffauth');
const { validateToken: validateUserToken } = require('../middlewares/userauth');

// GET: List redemptions with optional userId and rewardId filtering, and sorted
router.get("/", async (req, res) => {
    let { rewardId, userId, sortBy, order } = req.query;
    let whereClause = {};
    if (rewardId) whereClause.rewardId = rewardId;
    if (userId) whereClause.userId = userId;


    console.log('Query Params:', { rewardId, userId, sortBy, order });
    console.log('Where Clause:', whereClause);

    try {
        const redemptions = await Redemption.findAll({
            where: whereClause,
            order: [[sortBy || 'redeemedAt', order || 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: Reward,
                    as: 'reward',
                    attributes: ['id', 'title']
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


// PUT: Update a redemption by ID
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const redemption = await Redemption.findByPk(id);
    if (!redemption) {
        return res.sendStatus(404);
    }
    let data = req.body;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data
        let num = await Redemption.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Redemption was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update redemption with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// DELETE: Remove a redemption by ID
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const redemption = await Redemption.findByPk(id);

    if (!redemption) {
        return res.sendStatus(404);
    }

    const num = await Redemption.destroy({ where: { id: id } });
    if (num == 1) {
        res.json({ message: "Redemption was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete redemption with id ${id}.` });
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

        // Fetch the updated user data to return
        let updatedUser = await User.findByPk(userId);

        res.json({ message: 'Reward redeemed successfully', redemption, user: updatedUser });

    } catch (error) {
        console.error('Error redeeming reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
