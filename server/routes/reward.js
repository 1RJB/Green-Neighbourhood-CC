// reward.js
const express = require('express');
const router = express.Router();
const { Staff, Reward } = require('../models');
const yup = require("yup");
const { validateToken: validateStaffToken } = require('../middlewares/staffauth');

// Common validation schema
let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    startDate: yup.date().min(new Date()).required(),
    endDate: yup.date().min(yup.ref('startDate')).required(),
    points: yup.number().min(1).required(),
    category: yup.string().oneOf(['Vouchers', 'Gift_Cards', 'Health_And_Wellness', 'Workshops', 'Career_Development', 'Recognition', 'Others']).required(),
    maxEachRedeem: yup.number().min(1),
    maxTotalRedeem: yup.number().min(1)
});

// POST: Create a reward
router.post("/", validateStaffToken, async (req, res) => {
    let data = req.body;

    if (req.staff) {
        data.staffId = req.staff.id;
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

// GET: List rewards with optional search and category filtering
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let category = req.query.category;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
        ];
    }

    if (category && category !== 'All') {
        condition.category = category;
    }

    try {
        let list = await Reward.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            include: {
                model: Staff,
                as: "staff",
                attributes: ['firstName', 'lastName']
            }
        });
        res.json(list);
    } catch (err) {
        console.error('Error fetching rewards:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: Retrieve a specific reward by ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id, {
        include: {
            model: Staff,
            as: "staff",
            attributes: ['firstName', 'lastName']
        }
    });

    // Check if id not found
    if (!reward) {
        res.sendStatus(404);
        return;
    }
    res.json(reward);
});

// PUT: Update a reward by ID
router.put("/:id", validateStaffToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }
    // Check request user id
    let staffId = req.staff.id;
    if (reward.staffId != staffId) {
        res.sendStatus(403);
        return;
    }
    let data = req.body;

    // Verify owner of the reward
    if (req.user && reward.userId !== req.user.id) {
        res.sendStatus(403);
        return;
    }

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data
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

// DELETE: Remove a reward by ID
router.delete("/:id", validateStaffToken, async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }

    // Verify owner of the reward
    if (req.staff && reward.staffId !== req.staff.id) {
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

module.exports = router;
