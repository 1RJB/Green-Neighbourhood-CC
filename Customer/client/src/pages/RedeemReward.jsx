import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RedeemReward() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reward, setReward] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
            setLoading(false);
        });
    }, [id]);

    const handleRedeem = () => {
        http.post(`/reward/redeem/${id}`)
            .then(() => {
                toast.success('Reward redeemed successfully!');
                navigate('/rewards');
            })
            .catch((err) => {
                toast.error('Failed to redeem reward.');
            });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
            <Card sx={{ maxWidth: 600, width: '100%' }}>
                {
                    reward.imageFile && (
                        <CardMedia
                            component="img"
                            alt={reward.title}
                            height="300"
                            image={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                            title={reward.title}
                        />
                    )
                }
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {reward.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {reward.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Points Required: </strong>{reward.points}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Start Date: </strong>{dayjs(reward.startDate).format("D MMMM YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>End Date: </strong>{dayjs(reward.endDate).format("D MMMM YYYY")}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleRedeem} sx={{ mt: 2 }}>
                        Redeem
                    </Button>
                </CardContent>
            </Card>
            <ToastContainer />
        </Box>
    );
}

export default RedeemReward;
