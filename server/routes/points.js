const express = require('express');
const router = express.Router();
const { User } = require('../models');

// This endpoint will return information on how to earn points
router.get('/points-info', async (req, res) => {
    try {
        // Fetch point info from the database or define it statically for now
        const pointsInfo = [
            { title: 'Referral', description: 'Refer a friend to get points', points: 5000, actionText: 'Refer Now' },
            // Add more ways to earn points here
        ];
        res.json(pointsInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch points info' });
    }
});

module.exports = router;
