const express = require('express');
const router = express.Router();
const { User, Volunteer } = require('../models'); // Ensure correct import
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Create a new volunteer event
router.post("/", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;

  // Validate request body
  let validationSchema = yup.object({  
    dateAvailable: yup.date().required(),
    //timeAvailable: yup.string().matches(/^((0[1-9]|1[0-2]):[0-5]\d\s?(AM|PM|am|pm))$/, 'Invalid Time format').required('Time Available is required'),
    serviceType: yup.string().trim().max(100).required(),
    comments: yup.string().trim().max(500).required(),
    duration: yup.number().integer().min(0).nullable(),
    contactInfo: yup.string().trim().max(100).nullable(),
    photoPath: yup.string().trim().max(255).nullable(),
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    console.log(data.timeAvailable);
    let result = await Volunteer.create(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Get all volunteer events
router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { comments: { [Op.like]: `%${search}%` } }
    ];
  }
  // You can add condition for other columns here
  // e.g. condition.columnName = value;

  let list = await Volunteer.findAll({
    where: condition,
    order: [['createdAt', 'DESC']],
    include: { model: User, as: "user", attributes: ['name'] }
  });
  res.json(list);
});

// Get a single volunteer event by ID
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let volunteer = await Volunteer.findByPk(id, {
    include: { model: User, as: "user", attributes: ['name'] }
  });
  // Check if id not found
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }
  res.json(volunteer);
});

// Update a volunteer event
router.put("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check if id not found
  let volunteer = await Volunteer.findByPk(id);
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (volunteer.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    dateAvailable: yup.date().required('Date Available is required'),
    serviceType: yup.string().required('Service Type is required'),
    comments: yup.string().max(500, 'Comments must be at most 500 characters'),
    //timeAvailable: yup.string().matches(/^((0[1-9]|1[0-2]):[0-5]\d\s?(AM|PM|am|pm))$/, 'Invalid Time format').required('Time Available is required'),
    duration: yup.number().integer().min(0, 'Duration must be at least 0').nullable(),
    contactInfo: yup.string().max(100, 'Contact Info must be at most 100 characters').nullable(),
    photoPath: yup.string().max(255).nullable(),
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    let num = await Volunteer.update(data, {
      where: { id: id }
    });
    if (num == 1) {
      res.json({
        message: "Volunteer was updated successfully."
      });
    } else {
      res.status(400).json({
        message: `Cannot update volunteer with id ${id}.`
      });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Delete a volunteer event
router.delete("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check if id not found
  let volunteer = await Volunteer.findByPk(id);
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (volunteer.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let num = await Volunteer.destroy({
    where: { id: id }
  });
  if (num == 1) {
    res.json({
      message: "Volunteer was deleted successfully."
    });
  } else {
    res.status(400).json({
      message: `Cannot delete volunteer with id ${id}.`
    });
  }
});

module.exports = router;
