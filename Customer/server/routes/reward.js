const express = require('express');
const router = express.Router();
const { Customer, Reward } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.customerId = req.customer.id;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        startDate: yup.date().min(new Date()).required(),
        endDate: yup.date().min(yup.ref('startDate')).required(),
        points: yup.number().min(1).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Reward.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { startDate: { [Op.like]: `%${search}%` } },
            { endDate: { [Op.like]: `%${search}%` } },
            { points: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await Reward.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: Customer, as: "customer", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id, {
        include: { model: Customer, as: "customer", attributes: ['name'] }
    });
    // Check id not found
    if (!reward) {
        res.sendStatus(404);
        return;
    }
    res.json(reward);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }

    // Check request customer id
    let customerId = req.customer.id;
    if (reward.customerId != customerId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500),
        startDate: yup.date().min(new Date()),
        endDate: yup.date().min(yup.ref('startDate')),
        points: yup.number().min(1)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Reward.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Reward was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update reward with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }

    // Check request customer id
    let customerId = req.customer.id;
    if (reward.customerId != customerId) {
        res.sendStatus(403);
        return;
    }

    let num = await Reward.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Reward was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete reward with id ${id}.`
        });
    }
});

router.post("/redeem/:id", validateToken, async (req, res) => {
    const rewardId = req.params.id;
    const customerId = req.customer.id;

    try {
        // Fetch reward details
        const reward = await Reward.findByPk(rewardId);
        if (!reward) {
            return res.status(404).json({ error: "Reward not found" });
        }

        // Check if customer has enough points
        const customer = await Customer.findByPk(customerId);
        if (customer.points < reward.points) {
            return res.status(400).json({ error: "Insufficient points" });
        }

        // Deduct points and record redemption
        customer.points -= reward.points;
        await customer.save();

        const redemption = await Redemption.create({
            customerId,
            rewardId
        });

        res.json({ message: "Reward redeemed successfully", redemption });
    } catch (err) {
        res.status(500).json({ error: "Failed to redeem reward", details: err.message });
    }
});

module.exports = router;