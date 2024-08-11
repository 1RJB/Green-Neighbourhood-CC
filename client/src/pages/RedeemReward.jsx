import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import emailjs from 'emailjs-com'; // Import EmailJS

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
            let salutation = ""
            const { data } = await http.post(`/redemption/redeem/${id}`);
            toast.success(data.message);

            if (user.gender === 'Female') {
                salutation = 'Mrs.';
            } else {
                salutation = 'Mr.';
            };

            // Send email
            const templateParams = {
                to_email: user.email,
                salutation: salutation,
                last_name: user.lastName,
                reward_title: reward.title,
                reward_description: reward.description,
                reward_points: reward.points,
            };

            // Replace with your EmailJS service ID, template ID, and public key
            await emailjs.send('service_ktmad4e', 'template_dddco9z', templateParams, 'cjdyxWCfcHYahHas1');
            console.log('Email sent successfully');

            // Clear local storage or session storage if needed
            localStorage.removeItem('user'); // Or update accordingly

            // Update the context with the latest user data
            setUser(data.user);

            if (data.newAchievement) {
                toast.success("Congratulations! You've earned a new achievement!\n First Redemption !");
            }

            // Delay navigation to allow toast to display
            setTimeout(() => {
                navigate("/rewards");
            }, 5500); // 5.5 seconds delay
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to redeem reward.');
            console.error('Error sending email:', error);
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
                    <Typography variant="body2" color="text.secondary">
                        <strong>No. Redeemable: </strong>{reward?.maxEachRedeem}
                    </Typography>
                    {user && user.usertype === "user" && (
                        <Button variant="contained" color="primary" onClick={handleRedeem} sx={{ mt: 2 }}>
                            Redeem
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default RedeemReward;
