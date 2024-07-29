const express = require('express');
const router = express.Router();
const { User, Participant } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/userauth');

router.post("/", validateToken, async (req, res) => {
    const participantsData = req.body.participants; // Expecting an array of participants
    data.userId = req.user.id;
    if (!Array.isArray(participantsData)) {
        return res.status(400).json({ errors: "participantsData should be an array." });
    }

    const validationSchema = yup.object({
        firstName: yup.string().trim().min(3).max(25).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
        lastName: yup.string().trim().min(3).max(25).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).nullable(),
        gender: yup.string().oneOf(["Male", "Female"]).required(),
        birthday: yup.date().max(new Date()).required(),
        event: yup.string().trim().required(),
    });

    try {
        const results = [];

        for (const data of participantsData) {
            const validatedData = await validationSchema.validate(data, { abortEarly: false });
            validatedData.userId = userId;
            const result = await Participant.create(validatedData);
            results.push(`${result.firstName} ${result.lastName} is participating successfully.`);
        }

        res.json({ message: results });
    } catch (err) {
        console.error("Validation or creation error:", err);
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
        include: { model: User, as: "user", attributes: ['name'] }
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

router.put("/:id", async (req, res) => {
    const id = req.params.id;

    // Check if the participant exists
    const participant = await Participant.findByPk(id);
    if (!participant) {
        return res.sendStatus(404); // Return 404 if not found
    }

    // Define the validation schema
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
        // Validate the incoming data
        const data = await validationSchema.validate(req.body, { abortEarly: false });

        // Update the participant
        const [num] = await Participant.update(data, {
            where: { id: id }
        });

        if (num === 1) {
            res.json({
                message: "Participant was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update participant with id ${id}.`
            });
        }
    } catch (err) {
        console.error("Validation or update error:", err); // Log detailed error
        res.status(400).json({ errors: err.errors || err.message });
    }
});

module.exports = router;
