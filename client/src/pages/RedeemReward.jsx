import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Card, CardContent, CardMedia,
    CircularProgress
} from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

const RedeemReward = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [reward, setReward] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReward = async () => {
            try {
                const { data } = await http.get(`/reward/${id}`);
                setReward(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reward:', error.response?.data || error.message);
                setLoading(false);
            }
        };

        fetchReward();
    }, [id]);

    const handleRedeem = async () => {
        try {
            const { data } = await http.post(`/redemption/redeem/${id}`);
            toast.success(data.message);

            // Clear local storage or session storage if needed
            localStorage.removeItem('user'); // Or update accordingly

            // Update the context with the latest user data
            setUser(data.user);

        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to redeem reward.');
        }
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
                {reward?.imageFile && (
                    <CardMedia
                        component="img"
                        alt={reward.title}
                        height="300"
                        image={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                        title={reward.title}
                    />
                )}
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {reward?.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {reward?.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Points Required: </strong>{reward?.points}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Start Date: </strong>{dayjs(reward?.startDate).format("D MMMM YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>End Date: </strong>{dayjs(reward?.endDate).format("D MMMM YYYY")}
                    </Typography>
                    {user && user.usertype === "user" && (
                        <Button variant="contained" color="primary" onClick={handleRedeem} sx={{ mt: 2 }}>
                            Redeem
                        </Button>
                    )}
                </CardContent>
            </Card>
            <ToastContainer />
        </Box>
    );
};

export default RedeemReward;
