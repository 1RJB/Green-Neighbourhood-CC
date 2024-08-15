const express = require('express');
const router = express.Router();
const { User } = require('../models');

// This endpoint will return information on how to earn points
router.get('/points-info', async (req, res) => {
    try {
        // Point info, way to earn more points
        const pointsInfo = [
            { title: 'Events', description: 'Take part in events', points: 10000, actionText: 'Participate Now' },
            { title: 'Volunteers', description: 'Volunteer for a cause', points: 15000, actionText: 'Volunteer Now' }
            // Add more ways to earn points here
        ];
        res.json(pointsInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch points info' });
    }
});

module.exports = router;
