const express = require('express');
const router = express.Router();
const { Staff, Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/StaffAuth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    console.log('Received data:', data); // Log received data from frontend
    data.staffId = req.staff.id;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        // Add validation for eventDate and eventTime if necessary
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data   
        let result = await Event.create(data);
        console.log('Event created:', result); // Log created event
        res.json(result);
    } catch (err) {
        console.error('Error creating event:', err); // Log validation or database errors
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
    let list = await Event.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: Staff, as: "staff", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id, {
        include: { model: Staff, as: "staff", attributes: ['name'] }
    });

    // Check id not found
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});


router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    // Check request user id
    let staffId = req.staff.id;
    if (event.staffId != staffId) {
        res.sendStatus(403);
        return;
    }
        let data = req.body;
        // Validate request body
        let validationSchema = yup.object({
            title: yup.string().trim().min(3).max(100),
            description: yup.string().trim().min(3).max(500),
            eventDate: yup.date().required(),
            eventTime: yup.string().required()
        });
        try {
            data = await validationSchema.validate(data,
                { abortEarly: false });
            // Process valid data
            let num = await Event.update(data, {
                where: { id: id }
            });
            if (num == 1) {
                res.json({
                    message: "Event was updated successfully."
                });
            }
            else {
                res.status(400).json({
                    message: `Cannot update event with id ${id}.`
                });
            }
        }
        catch (err) {
            res.status(400).json({ errors: err.errors });
        }

    });

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    let num = await Event.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Event was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete event with id ${id}.`
        });
    }
});
module.exports = router;