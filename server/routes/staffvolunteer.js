const express = require('express');
const router = express.Router();
const { Volunteer, User } = require('../models');
const { Op } = require('sequelize');
const { validateToken } = require('../middlewares/staffauth');
const nodemailer = require('nodemailer');

// Get all volunteer tickets for staff to view
router.get('/', validateToken, async (req, res) => {
  try {
    const volunteerTickets = await Volunteer.findAll({
      order: [['createdAt', 'DESC']],
      include: { model: User, as: 'User', attributes: ['firstName', 'lastName', 'email'] }
    });
    res.json(volunteerTickets);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving volunteer tickets', error: err });
  }
});

// Accept a volunteer ticket
router.put('/:id/accept', validateToken, async (req, res) => {
  const volunteerId = req.params.id;
  const { message } = req.body;

  try {
    // Find the volunteer ticket
    const volunteer = await Volunteer.findByPk(volunteerId, {
      include: { model: User, as: 'User', attributes: ['firstName', 'lastName', 'email'] }
    });

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer ticket not found' });
    }

    // Send an email to the user
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: volunteer.User.email,
      subject: 'Volunteer Ticket Accepted',
      text: `Dear ${volunteer.User.firstName},\n\nYour volunteer ticket has been accepted. ${message}\n\nThank you for volunteering!\n\nBest regards,\n[Your Organization's Name]`
    };

    await transporter.sendMail(mailOptions);

    // Optionally, update the status of the ticket or add any other logic
    // await volunteer.update({ status: 'Accepted' });

    res.json({ message: 'Volunteer ticket accepted and user notified by email' });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting volunteer ticket', error: err });
  }
});

module.exports = router;
