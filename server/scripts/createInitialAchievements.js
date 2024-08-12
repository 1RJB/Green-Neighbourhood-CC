const { Achievement } = require('../models');

async function createInitialAchievements() {
    const initialAchievements = [
        {
            title: 'First Redemption',
            description: 'Redeemed your first reward',
            type: 'first_redemption',
            imageFile: 'first_redemption.webp',
            condition: 'First time redeeming  a reward'  
        },
        {
            title: 'First Redemption Collected',
            description: 'First collection of your redeemed reward',
            type: 'first_redemption_collected',
            imageFile: 'first_redemption_collected.webp',
            condition: 'First time collected a redeemed reward'
        },
        {
            title: 'First Event Registration',
            description: 'Registered in your first event',
            type: 'first_event_registration',
            imageFile: 'first_event_registration.webp',
            condition: 'First time registering for an event'
        },
        {
            title: 'First Event Participation',
            description: 'Participated in your first event',
            type: 'first_event_participation',
            imageFile: 'first_event_participation.webp',
            condition: 'First time participated in an event'
        },
        {
            title: 'First Volunteer Activity',
            description: 'Volunteered for the first time',
            type: 'first_volunteer',
            imageFile: 'first_volunteer.webp',
            condition: 'First time volunteering'
        }
    ];

    for (const achievement of initialAchievements) {
        const [existingAchievement, created] = await Achievement.findOrCreate({
            where: { type: achievement.type },
            defaults: achievement
        });

        if (created) {
            console.log(`Created achievement: ${achievement.title}`);
        } else {
            console.log(`Achievement already exists: ${achievement.title}`);
        }
    }

    console.log('Initial achievements check completed');
}

module.exports = createInitialAchievements;
