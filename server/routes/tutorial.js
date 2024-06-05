const express = require('express');
const router = express.Router();
const { User, Tutorial } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Tutorial.create(data);
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

    let list = await Tutorial.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let tutorial = await Tutorial.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }
    res.json(tutorial);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (tutorial.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Tutorial.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Tutorial was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update tutorial with id ${id}.`
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
    let tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (tutorial.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Tutorial.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Tutorial was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete tutorial with id ${id}.`
        });
    }
});

module.exports = router;