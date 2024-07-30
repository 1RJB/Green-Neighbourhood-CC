import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Star, EmojiEvents } from '@mui/icons-material';
import http from '../http';
import CustomerContext from '../contexts/CustomerContext';
import { keyframes } from '@emotion/react';

function Points() {
    const [pointsInfo, setPointsInfo] = useState([]);
    const { customer } = useContext(CustomerContext);

    const getPointsInfo = () => {
        http.get('/points/points-info').then((res) => {
            setPointsInfo(res.data);
        }).catch(err => {
            console.error("Failed to fetch points info:", err.response.data);
        });
    };

    useEffect(() => {
        getPointsInfo();
    }, []);

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const spinCombined = keyframes`
        0% { transform: perspective(500px) rotateX(${getRandomInt(-360, 360)}deg) rotateY(${getRandomInt(-360, 360)}deg) rotateZ(${getRandomInt(-360, 360)}deg) scale(1); }
        25% { transform: perspective(800px) rotateX(${getRandomInt(-360, 360)}deg) rotateY(${getRandomInt(-360, 360)}deg) rotateZ(${getRandomInt(-360, 360)}deg) scale(1.2); }
        50% { transform: perspective(600px) rotateX(${getRandomInt(-360, 360)}deg) rotateY(${getRandomInt(-360, 360)}deg) rotateZ(${getRandomInt(-360, 360)}deg) scale(0.8); }
        75% { transform: perspective(400px) rotateX(${getRandomInt(-360, 360)}deg) rotateY(${getRandomInt(-360, 360)}deg) rotateZ(${getRandomInt(-360, 360)}deg) scale(1.1); }
        100% { transform: perspective(700px) rotateX(${getRandomInt(-360, 360)}deg) rotateY(${getRandomInt(-360, 360)}deg) rotateZ(${getRandomInt(-360, 360)}deg) scale(1); }
    `;

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Points
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star
                    sx={{
                        mr: 1,
                        animation: `${spinCombined} 8s infinite`,
                    }}
                    color="primary"
                />
                <Typography variant="h4">
                    {customer ? customer.points : 0} Points
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
                                    onClick={() => {/* Handle action */ }}
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
}

export default Points;
