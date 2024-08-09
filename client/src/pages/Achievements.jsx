import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import http from '../http';

function Achievements() {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        http.get('/achievement').then((res) => {
            setAchievements(res.data);
        });
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                My Achievements
            </Typography>
            <Grid container spacing={2}>
                {achievements.map((achievement) => (
                    <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{achievement.title}</Typography>
                                <Typography>{achievement.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Achievements;
