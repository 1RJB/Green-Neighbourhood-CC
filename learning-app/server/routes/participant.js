const express = require('express');
const router = express.Router();
const { User, Participant } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Participant.create(data);
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
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await Participant.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let participant = await Participant.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!participant) {
        res.sendStatus(404);
        return;
    }
    res.json(participant);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let participant = await Participant.findByPk(id);
    if (!participant) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (participant.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        Fname: yup.string().trim().min(3).max(100).required(),
        Lname: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().email().max(100).required(),
        gender: yup.string().trim().oneOf(['male', 'female']).required(),
        birthday: yup.date().required(),
        event: yup.string().trim().required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Participant.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Participant was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update participant with id ${id}.`
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
    let participant = await Participant.findByPk(id);
    if (!participant) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (participant.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Participant.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Participant was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete participant with id ${id}.`
        });
    }
});

module.exports = router;