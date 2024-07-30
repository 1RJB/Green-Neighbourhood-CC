const express = require('express');
const router = express.Router();
const { Staff, Customer, Reward, Redemption } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Common validation schema
const validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    startDate: yup.date().min(new Date()).required(),
    endDate: yup.date().min(yup.ref('startDate')).required(),
    points: yup.number().min(1).required()
});

// Route to create reward
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    if (req.staff) {
        data.staffId = req.staff.id;
    } else if (req.customer) {
        data.customerId = req.customer.id;
    } else {
        return res.sendStatus(401);
    }

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Reward.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Route to get all rewards
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%{search}%` } },
            { startDate: { [Op.like]: `%{search}%` } },
            { endDate: { [Op.like]: `%{search}%` } },
            { points: { [Op.like]: `%{search}%` } }
        ];
    }

    let list = await Reward.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: [
            { model: Staff, as: "staff", attributes: ['name'] },
            { model: Customer, as: "customer", attributes: ['name'] }
        ]
    });
    res.json(list);
});

// Route to get reward by id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id, {
        include: [
            { model: Staff, as: "staff", attributes: ['name'] },
            { model: Customer, as: "customer", attributes: ['name'] }
        ]
    });
    if (!reward) {
        res.sendStatus(404);
        return;
    }
    res.json(reward);
});

// Route to update reward
router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;

    // Verify owner of the reward
    if ((req.staff && reward.staffId !== req.staff.id) || (req.customer && reward.customerId !== req.customer.id)) {
        res.sendStatus(403);
        return;
    }

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let num = await Reward.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Reward was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update reward with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Route to delete reward
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }

    // Verify owner of the reward
    if ((req.staff && reward.staffId !== req.staff.id) || (req.customer && reward.customerId !== req.customer.id)) {
        res.sendStatus(403);
        return;
    }

    let num = await Reward.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Reward was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete reward with id ${id}.`
        });
    }
});

// Route to fetch redemptions with filtering and sorting
router.get('/redemptionsmade', validateToken, async (req, res) => {
    const { rewardId, customerId, sortBy, order } = req.query;

    let whereClause = {};
    if (rewardId) whereClause.rewardId = rewardId;
    if (customerId) whereClause.customerId = customerId;

    try {
        const redemptions = await Redemption.findAll({
            where: whereClause,
            include: [
                { model: Customer, attributes: ['id', 'name', 'email'] },
                { model: Reward, attributes: ['id', 'title'] }
            ],
            order: [[sortBy || 'redeemedAt', order || 'DESC']]
        });

        res.json(redemptions);
    } catch (error) {
        console.error('Error fetching redemptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to redeem a reward
router.post('/redeem/:rewardId', validateToken, async (req, res) => {
    const rewardId = req.params.rewardId;
    const customerId = req.customer.id;

    try {
        // Find the reward and customer
        const reward = await Reward.findByPk(rewardId);
        const customer = await Customer.findByPk(customerId);

        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Check if the customer has enough points
        if (customer.points < reward.points) {
            return res.status(400).json({ error: 'Not enough points to redeem the reward' });
        }

        // Check if the customer has already redeemed this reward too many times
        const customerRedemptionCount = await Redemption.count({
            where: {
                rewardId: rewardId,
                customerId: customerId
            }
        });

        if (reward.maxEachRedeem !== null && customerRedemptionCount >= reward.maxEachRedeem) {
            return res.status(400).json({ error: 'You have already redeemed this reward the maximum allowed number of times.' });
        }

        // Check if the total number of redemptions has reached the limit
        const totalRedemptionCount = await Redemption.count({
            where: {
                rewardId: rewardId
            }
        });

        if (reward.maxTotalRedeem !== null && totalRedemptionCount >= reward.maxTotalRedeem) {
            return res.status(400).json({ error: 'This reward has already been redeemed the maximum allowed number of times.' });
        }

        // Reduce customer points
        customer.points -= reward.points;
        await customer.save();

        // Create redemption record
        const redemption = await Redemption.create({
            customerId: customer.id,
            rewardId: reward.id,
            redeemedAt: new Date()
        });

        // Fetch the updated customer data to return
        const updatedCustomer = await Customer.findByPk(customerId);

        res.json({ message: 'Reward redeemed successfully', redemption, customer: updatedCustomer });

    } catch (error) {
        console.error('Error redeeming reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
