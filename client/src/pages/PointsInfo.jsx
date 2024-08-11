import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Forest, EmojiEvents } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { keyframes } from '@emotion/react';

const Points = () => {
    const [pointsInfo, setPointsInfo] = useState([]);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await http.get('/user/userInfo');
                setUser(data); // Update user data in context
            } catch (err) {
                console.error('Failed to fetch user data:', err.response?.data || err.message);
            }
        };

        const fetchPointsInfo = async () => {
            try {
                const { data } = await http.get('/points/points-info');
                setPointsInfo(data);
            } catch (err) {
                console.error('Failed to fetch points info:', err.response?.data || err.message);
            }
        };

        // Fetch user data and points info on mount
        fetchUserData();
        fetchPointsInfo();
    }, []);

    const spinCombined = keyframes`
    0% { transform: perspective(500px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg) scale(1); }
    25% { transform: perspective(800px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg) scale(1.2); }
    50% { transform: perspective(600px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg) scale(0.8); }
    75% { transform: perspective(400px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg) scale(1.1); }
    100% { transform: perspective(700px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg) scale(1); }
  `;

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Points
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Forest
                    sx={{
                        mr: 1,
                        animation: `${spinCombined} 8s infinite`,
                    }}
                    color="primary"
                />
                <Typography variant="h4">
                    {user?.points || 0} Points
                </Typography>
            </Box>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Ways to Earn More Points
            </Typography>
            <Grid container spacing={2}>
                {pointsInfo.map((info, i) => (
                    <Grid item xs={12} md={6} lg={4} key={i}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <EmojiEvents sx={{ mr: 1 }} color="primary" />
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {info.title}
                                    </Typography>
                                    <Typography color="primary">
                                        +{info.points} Points
                                    </Typography>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {info.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => {/* Handle action */}}
                                >
                                    {info.actionText}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Points;
