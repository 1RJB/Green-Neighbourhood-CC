const express = require('express');
const router = express.Router();
const { Staff, Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/staffauth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    console.log('Received data:', data); // Log received data from frontend
    data.staffId = req.staff.id;
    
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500),
        eventDate: yup.date().required(),
        endDate: yup.date().required(),
        eventTime: yup.string().required(),
        endTime: yup.string().required(),
        category: yup.string().oneOf(['Sustainable', 'Sports', 'Community', 'Workshop', 'Others']).required()
    });
    
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check for existing event with the same title
        const existingEvent = await Event.findOne({ where: { title: data.title } });
        if (existingEvent) {
            return res.status(400).json({ errors: ['An event with this title already exists.'] });
        }

        // Process valid data   
        let result = await Event.create(data);
        console.log('Event created:', result); // Log created event
        res.json(result);
    } catch (err) {
        console.error('Error creating event:', err); // Log validation or database errors
        res.status(400).json({ errors: err.errors || ['An error occurred while creating the event.'] });
    }
});

// GET: List events with optional search and category filtering
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let category = req.query.category;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    
    if (category && category !== 'All') {
        condition.category = category;
    }

    try {
        let list = await Event.findAll({
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
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET: Retrieve a specific event by ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id, {
        include: { 
            model: Staff, 
            as: "staff", 
            attributes: ['firstName', 'lastName'] 
        }
    });

    // Check if id not found
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

// PUT: Update an event by ID
router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check if id not found
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
        eventDate: yup.date(),
        endDate: yup.date(),
        eventTime: yup.string(),
        endTime: yup.string(),
        category: yup.string().oneOf(['Sustainable', 'Sports', 'Community', 'Workshop', 'Others'])
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data
        let num = await Event.update(data, {
            where: { id: id }
        });
        if (num[0] == 1) { // num[0] is the number of affected rows
            res.json({
                message: "Event was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update event with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


// DELETE: Remove an event by ID
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
    } else {
        res.status(400).json({
            message: `Cannot delete event with id ${id}.`
        });
    }
});

module.exports = router;
