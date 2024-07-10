import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import http from '../http';

function CustomerRewards() {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get('/rewards').then((res) => {
            setRewards(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Available Rewards
            </Typography>
            {
                !loading && (
                    <Grid container spacing={2}>
                        {rewards.map(reward => (
                            <Grid item xs={12} md={6} lg={4} key={reward.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{reward.title}</Typography>
                                        <Typography variant="body2">{reward.description}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" href={`/redeem/${reward.id}`}>Redeem</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )
            }
        </Box>
    );
}

export default CustomerRewards;
