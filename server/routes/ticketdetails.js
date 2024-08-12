const express = require("express");
const nodemailer = require("nodemailer");
const { Volunteer, User } = require("../models"); // Adjust the path if needed
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Use environment variable for email
        pass: process.env.EMAIL_PASS  // Use environment variable for app password
    }
});

// GET request to fetch ticket and user information
router.get("/:id", async (req, res) => {
    try {
        const ticketId = req.params.id;

        // Fetch ticket information
        const volunteer = await Volunteer.findByPk(ticketId);
        if (!volunteer) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Fetch user information
        const user = await User.findByPk(volunteer.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Respond with both ticket and user information
        res.json({ volunteer, user });
    } catch (error) {
        console.error("Error fetching ticket details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE request to delete a ticket and send an email
router.delete("/:id", async (req, res) => {
    const ticketId = req.params.id;
    const { emailMessage } = req.body;

    try {
        // Fetch ticket information
        const volunteer = await Volunteer.findByPk(ticketId);
        if (!volunteer) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Fetch user information
        const user = await User.findByPk(volunteer.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Default message with custom message
        const defaultMessage = `
            Your volunteer ticket has been processed successfully. A message has been included below for you:

            ${emailMessage || "No additional message provided."}
        `;

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your ticket has been processed",
            text: defaultMessage
        };

        await transporter.sendMail(mailOptions);

        // Delete the ticket
        await Volunteer.destroy({ where: { id: ticketId } });

        res.json({ message: "Ticket deleted and email sent" });
    } catch (error) {
        console.error("Error deleting ticket or sending email:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
