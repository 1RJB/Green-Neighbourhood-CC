import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const events = [
    { id: 1, title: 'Tree Planting', description: 'Join us for a tree planting event to help increase urban greenery.' },
    { id: 2, title: 'Beach Cleanup', description: 'Help us clean up the beach and protect marine life.' },
    { id: 3, title: 'Recycling Workshop', description: 'Learn about recycling and how to properly sort your waste.' },
    { id: 4, title: 'Wildlife Conservation', description: 'Participate in activities to help conserve local wildlife.' },
    { id: 5, title: 'Community Garden', description: 'Assist in the creation and maintenance of a community garden.' }
];

function Events() {
    const navigate = useNavigate();

    const handleParticipate = (event) => {
        navigate('/participateevent', { state: { event: event.title } });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Upcoming Events
            </Typography>
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {event.title}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {event.description}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleParticipate(event)}>
                                    Participate
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <ToastContainer />
        </Box>
    );
}

export default Events;
