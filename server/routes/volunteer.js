const express = require('express');
const router = express.Router();
const { User, Volunteer, Achievement, UserAchievement } = require('../models'); // Ensure correct import
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/userauth');
const { isVolunteer } = require('../middlewares/roleauth'); // Import the role validation middleware

// Create a new volunteer event
router.post("/", validateToken, isVolunteer, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;

  // Validate request body
  let validationSchema = yup.object({
      dateAvailable: yup.date().required(),
      serviceType: yup.string().trim().max(100).required(),
      comments: yup.string().trim().max(500).required(),
      duration: yup.number().integer().min(0).nullable(),
      contactInfo: yup.string().trim().max(100).nullable(),
      photoPath: yup.string().trim().max(255).nullable(),
  });

  try {
      data = await validationSchema.validate(data, { abortEarly: false });
      let result = await Volunteer.create(data);

      // Fetch the user associated with the volunteer event
      const user = await User.findByPk(req.user.id, { include: [{ model: Achievement, as: 'achievements' }] });
      let newAchievement = false;

      user.points += 15000;
      await user.save();

      // Check if this is the user's first volunteer event creation
      if (!user.achievements.some(a => a.type === 'first_volunteer')) {
          const firstVolunteerAchievement = await Achievement.findOne({ where: { type: 'first_volunteer' } });
          if (firstVolunteerAchievement) {
              await user.addAchievement(firstVolunteerAchievement);

              // Update the notice field in userachievements table
              await UserAchievement.update(
                  { notice: 1 },
                  { where: { userId: user.id, achievementId: firstVolunteerAchievement.id } }
              );

              newAchievement = true;
          }
      }

      res.json({ result, newAchievement, updatedPoints: user.points });
  } catch (err) {
      res.status(400).json({ errors: err.errors });
  }
});

// Get a list of volunteer events
router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { comments: { [Op.like]: `%${search}%` } }
    ];
  }
  let list = await Volunteer.findAll({
    where: condition,
    order: [['createdAt', 'DESC']],
    include: { model: User, as: 'User', attributes: ['firstName', 'lastName'] } // Updated alias
  });
  res.json(list);
});

// Get a list of the user's volunteer tickets
router.get("/my-tickets", validateToken, isVolunteer, async (req, res) => {
  try {
      const userId = req.user.id; 
      const volunteers = await Volunteer.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          include: { model: User, as: 'User', attributes: ['firstName', 'lastName'] }
      });
      res.json(volunteers);
  } catch (err) {
      console.error("Failed to fetch user-specific tickets:", err);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single volunteer ticket by ID
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let volunteer = await Volunteer.findByPk(id, {
    include: { model: User, as: 'User', attributes: ['firstName', 'lastName'] } // Updated alias
  });
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }
  res.json(volunteer);
});

// Update a volunteer event
router.put("/:id", validateToken, isVolunteer, async (req, res) => {
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
    duration: yup.number().integer().min(0, 'Duration must be at least 0').nullable(),
    contactInfo: yup.string().max(100, 'Contact Info must be at most 100 characters').nullable(),
    photoPath: yup.string().max(255).nullable(),
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    let num = await Volunteer.update(data, { where: { id: id } });
    if (num == 1) {
      res.json({ message: "Volunteer was updated successfully." });
    } else {
      res.status(400).json({ message: `Cannot update volunteer with id ${id}.` });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

// Delete a volunteer event
router.delete("/:id", validateToken, isVolunteer, async (req, res) => {
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
  let num = await Volunteer.destroy({ where: { id: id } });
  if (num == 1) {
    res.json({ message: "Volunteer was deleted successfully." });
  } else {
    res.status(400).json({ message: `Cannot delete volunteer with id ${id}.` });
  }
});

module.exports = router;
