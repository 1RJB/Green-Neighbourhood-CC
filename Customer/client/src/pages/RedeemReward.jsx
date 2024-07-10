import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import http from '../http';
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

    return (
        <Box>
            {
                !loading && reward && (
                    <Box>
                        <Typography variant="h5" sx={{ my: 2 }}>
                            {reward.title}
                        </Typography>
                        <Typography variant="body1">
                            {reward.description}
                        </Typography>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleRedeem}>
                            Redeem
                        </Button>
                    </Box>
                )
            }
            <ToastContainer />
        </Box>
    );
}

export default RedeemReward;
