const express = require('express');
const router = express.Router();
const { Participant } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/participate", async (req, res) => {
    const data = req.body;
    const validationSchema = yup.object({
        firstName: yup
            .string()
            .trim()
            .min(3)
            .max(25)
            .required()
            .matches(
                /^[a-zA-Z '-,.]+$/,
                "Name only allows letters, spaces, and characters: ' - , ."
            ),
        lastName: yup
            .string()
            .trim()
            .min(3)
            .max(25)
            .required()
            .matches(
                /^[a-zA-Z '-,.]+$/,
                "Name only allows letters, spaces, and characters: ' - , ."
            ),
        email: yup.string().trim().lowercase().email().max(50).nullable(),
        gender: yup.string().oneOf(["Male", "Female"]).required(),
        birthday: yup.date().max(new Date()).required(),
        event: yup.string().trim().required(),
    });

    try {
        const validatedData = await validationSchema.validate(data, { abortEarly: false });
        const result = await Participant.create(validatedData);
        res.json({
            message: `${result.firstName} ${result.lastName} is Participating successfully.`,
        });
    } catch (err) {
        console.error("Validation or creation error:", err); // Log the detailed error
        res.status(400).json({ errors: err.errors || err.message });
    }
});

router.get("/", async (req, res) => {
    const condition = {};
    const search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } }
        ];
    }

    const list = await Participant.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
    });
    res.json(list);
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const participant = await Participant.findByPk(id);
    if (!participant) {
        res.sendStatus(404);
        return;
    }

    const num = await Participant.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Participant was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete participant with id ${id}.`
        });
    }
});

module.exports = router;
