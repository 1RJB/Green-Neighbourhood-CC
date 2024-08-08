const express = require('express');
const router = express.Router();
const { User, Participant } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/userauth');

// Create new participants
router.post("/", validateToken, async (req, res) => {
    const participantsData = req.body.participants;
    const userId = req.user.id;

    if (!Array.isArray(participantsData)) {
        return res.status(400).json({ errors: "participantsData should be an array." });
    }

    const validationSchema = yup.object({
        firstName: yup.string().trim().min(3).max(25).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
        lastName: yup.string().trim().min(3).max(25).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        gender: yup.string().oneOf(["Male", "Female"]).required(),
        birthday: yup.date().max(new Date()).required(),
        event: yup.string().trim().required(),
    });

    try {
        const results = [];

        for (const data of participantsData) {
            const validatedData = await validationSchema.validate(data, { abortEarly: false });

            // Check if participant already exists
            const existingParticipant = await Participant.findOne({
                where: {
                    email: validatedData.email,
                    event: validatedData.event,
                }
            });

            if (existingParticipant) {
                throw new Error(`${validatedData.firstName} ${validatedData.lastName} has already participated in this event.`);
            }

            validatedData.userId = userId;
            validatedData.status = "Joined";
            const result = await Participant.create(validatedData);
            results.push(`${result.firstName} ${result.lastName} is participating successfully.`);
        }

        res.json({ message: results });
    } catch (err) {
        console.error("Validation or creation error:", err);
        res.status(400).json({ errors: err.errors || err.message });
    }
});

router.get("/", validateToken, async (req, res) => {
    const { search } = req.query;
    const userId = req.user.id; // ID of the user making the request
    const userType = req.user.usertype; // User type (staff or user)

    const condition = {};

    // Add search condition
    if (search) {
        condition[Op.or] = [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { event: { [Op.like]: `%${search}%` } }
        ];
    }

    if (userType !== 'staff') {
        condition.userId = userId;
    }
    try {
        const list = await Participant.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            include: { model: User, as: "user", attributes: ['firstName', 'lastName'] }
        });
        res.json(list);
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ message: "Error fetching participants" });
    }
});

// Delete participant by ID
router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const participant = await Participant.findByPk(id);

        if (!participant) {
            return res.sendStatus(404);
        }

        const num = await Participant.destroy({ where: { id: id } });
        if (num === 1) {
            res.json({ message: "Participant was deleted successfully." });
        } else {
            res.status(400).json({ message: `Cannot delete participant with id ${id}.` });
        }
    } catch (error) {
        console.error("Error deleting participant:", error);
        res.status(500).json({ message: "Error deleting participant" });
    }
});

// Get participant by ID
router.get("/:id", validateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const participant = await Participant.findByPk(id);

        if (!participant) {
            return res.sendStatus(404);
        }

        res.json(participant);
    } catch (error) {
        console.error("Error fetching participant:", error);
        res.status(500).json({ message: "Error fetching participant" });
    }
});

// Update participant by ID
router.put("/:id", validateToken, async (req, res) => {
    const id = req.params.id;

    try {
        // Check if the participant exists
        const participant = await Participant.findByPk(id);
        if (!participant) {
            return res.sendStatus(404);
        }

        // Define the validation schema
        const validationSchema = yup.object({
            firstName: yup.string().trim().min(3).max(25).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
            lastName: yup.string().trim().min(3).max(25).required().matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
            email: yup.string().trim().lowercase().email().max(50).required(),
            gender: yup.string().oneOf(["Male", "Female"]).required(),
            birthday: yup.date().max(new Date()).required(),
            event: yup.string().trim().required(),
            status: yup.string().oneOf(["Joined", "Participated"]).required(),
        });

        // Validate the incoming data
        const data = await validationSchema.validate(req.body, { abortEarly: false });

        // Update the participant
        const [num] = await Participant.update(data, { where: { id: id } });

        if (num === 1) {
            res.json({ message: "Participant was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update participant with id ${id}.` });
        }
    } catch (err) {
        console.error("Validation or update error:", err);
        res.status(400).json({ errors: err.errors || err.message });
    }
});

module.exports = router;
