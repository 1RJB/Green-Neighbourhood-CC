// File Path: client/src/pages/Home.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [rewards, setRewards] = useState([]);
  const { user, setUser } = useContext(UserContext);
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

    const fetchEvents = async () => {
      try {
        const { data } = await http.get('/events');
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err.response?.data || err.message);
      }
    };

    const fetchRewards = async () => {
      try {
        const { data } = await http.get('/rewards');
        setRewards(data);
      } catch (err) {
        console.error('Failed to fetch rewards:', err.response?.data || err.message);
      }
    };

    fetchUserData();
    fetchEvents();
    fetchRewards();
  }, []);

  useEffect(() => {
    const eventInterval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => (events.length > 0 ? (prevIndex + 1) % events.length : 0));
    }, 3000); // Change event every 3 seconds

    const rewardInterval = setInterval(() => {
      setCurrentRewardIndex((prevIndex) => (rewards.length > 0 ? (prevIndex + 1) % rewards.length : 0));
    }, 3000); // Change reward every 3 seconds

    return () => {
      clearInterval(eventInterval);
      clearInterval(rewardInterval);
    };
  }, [events, rewards]);

  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                Events
              </Typography>
              {events.length > 0 ? (
                <Typography variant="body1">
                  {events[currentEventIndex].name}
                </Typography>
              ) : (
                <Typography variant="body1">No events available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                Rewards
              </Typography>
              {rewards.length > 0 ? (
                <Typography variant="body1">
                  {rewards[currentRewardIndex].name}
                </Typography>
              ) : (
                <Typography variant="body1">No rewards available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                Welcome, {user?.firstName || 'Guest'}!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                Points
              </Typography>
              <Typography variant="body1">
                You have {user?.points || 0} points.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;