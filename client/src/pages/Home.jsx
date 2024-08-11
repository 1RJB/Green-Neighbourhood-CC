import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import './pages.css'; // Import the CSS file for styles

const Home = () => {
    const [events, setEvents] = useState([]);
    const [rewards, setRewards] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [userCount, setUserCount] = useState(0);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await http.get('/user/userInfo');
                setUser(data);
            } catch (err) {
                console.error('Failed to fetch user data:', err.response?.data || err.message);
            }
        };

        fetchUserData();
    }, [setUser]);

    useEffect(() => {
        const fetchUserAchievements = async () => {
            if (!user) return;

            try {
                const { data } = await http.get('/achievement/withnotice'); // Use the new route
                if (data.length > 0) {
                    // Reset the notice field
                    await http.put('/achievement/resetnotices');
                    toast.done("Congrats, you got a new achievement! You can view on the Acheivements page.");

                }
            } catch (err) {
                console.error('Failed to fetch user achievements:', err.response?.data || err.message);
            }
        };

        const fetchEvents = async () => {
            try {
                const { data } = await http.get('/event');
                setEvents(data);
            } catch (err) {
                console.error('Failed to fetch events:', err.response?.data || err.message);
            }
        };

        const fetchRewards = async () => {
            try {
                const { data } = await http.get('/reward');
                setRewards(data);
            } catch (err) {
                console.error('Failed to fetch rewards:', err.response?.data || err.message);
            }
        };

        const fetchUserCount = async () => {
            try {
                const { data } = await http.get('/user/count');
                setUserCount(data.count);
            } catch (err) {
                console.error('Failed to fetch user count:', err);
            };
        }

        fetchEvents();
        fetchRewards();

        if (user) {
            fetchUserAchievements();
        }

        if (user && user.usertype === 'staff') {
            fetchUserCount();
        }
    }, [user]);

    useEffect(() => {
        const eventInterval = setInterval(() => {
            setCurrentEventIndex((prevIndex) => (events.length > 0 ? (prevIndex + 1) % events.length : 0));
        }, 5000); // Change event every 3 seconds

        const rewardInterval = setInterval(() => {
            setCurrentRewardIndex((prevIndex) => (rewards.length > 0 ? (prevIndex + 1) % rewards.length : 0));
        }, 3000); // Change reward every 3 seconds

        return () => {
            clearInterval(eventInterval);
            clearInterval(rewardInterval);
        };
    }, [events, rewards]);

    // Slice the rewards to display three at a time and cycle through them
    const getVisibleRewards = () => {
        if (rewards.length === 0) return [];
        const start = currentRewardIndex;
        return [
            rewards[start % rewards.length],
            rewards[(start + 1) % rewards.length],
            rewards[(start + 2) % rewards.length],
        ];
    };

    return (
        <Container className="homepage">
            <Grid container spacing={2}>
                {/* Big Tile - Events */}
                <Grid item xs={12} md={7} className="tile-large">
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>
                                Upcoming Events
                            </Typography>
                            {events.length > 0 ? (
                                <Box className="carousel">
                                    <Box className="pages-image-container">
                                        <img
                                            alt="event"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${events[currentEventIndex].imageFile}`}
                                            className="pages-image"
                                        />
                                    </Box>
                                    <Typography variant="h6" component="h3" align="center">
                                        {events[currentEventIndex].title}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body1">No events available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Medium Tile - Rewards */}
                <Grid item xs={12} md={4} className="tile-medium">
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>
                                Rewards
                            </Typography>
                            {rewards.length > 0 ? (
                                <Box className="reward-carousel">
                                    {getVisibleRewards().map((reward) => (
                                        <Box key={reward.id} className="reward-item">
                                            <img
                                                alt={reward.title}
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                                                className="reward-image"
                                            />
                                            <Typography variant="h6" component="h3" className="reward-title">
                                                {reward.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body1">No rewards available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Slightly Smaller Tile - Welcome User */}
                <Grid item xs={12} md={6} className="greeting-tile tile-small">
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h4" component="h2" gutterBottom>
                                Welcome, {user?.firstName || 'Guest'}!
                            </Typography>
                            <Typography variant="h5" color={'secondary.light'}>
                                Would you like to make a difference?
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Small Tile - Points */}
                <Grid item xs={12} md={5} className="points-tile tile-small">
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            {user && user.usertype === "user" && (
                                <>
                                    <Typography variant="h4" component="h2" textAlign={'left'} gutterBottom>
                                        Points
                                    </Typography>
                                    <Typography variant="body1">
                                        You have {user?.points || 0} points.
                                    </Typography>
                                </>
                            )}
                            {user && user.usertype === "staff" && (
                                <>
                                    <Typography variant="h4" component="h2" textAlign={'left'} gutterBottom>
                                        No. of Users
                                    </Typography>
                                    <Typography variant="body1">
                                        We have {userCount || 0} users.
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;