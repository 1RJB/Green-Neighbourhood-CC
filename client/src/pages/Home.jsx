import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css'; // Assuming you have a CSS file for styling

const Home = () => {
  const [events, setEvents] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState({ firstName: '', points: 0 });
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  // Fetch events from API
  useEffect(() => {
    axios.get('/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  // Fetch rewards from API
  useEffect(() => {
    axios.get('/rewards')
      .then(response => setRewards(response.data))
      .catch(error => console.error('Error fetching rewards:', error));
  }, []);

  // Fetch user data from API
  useEffect(() => {
    axios.get('/auth/user') // Adjust endpoint as necessary
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Cycle through events every 5 seconds
  useEffect(() => {
    const eventInterval = setInterval(() => {
      setCurrentEventIndex(prevIndex => (prevIndex + 1) % events.length);
    }, 5000);
    return () => clearInterval(eventInterval);
  }, [events]);

  // Cycle through rewards every 5 seconds
  useEffect(() => {
    const rewardInterval = setInterval(() => {
      setCurrentRewardIndex(prevIndex => (prevIndex + 1) % rewards.length);
    }, 5000);
    return () => clearInterval(rewardInterval);
  }, [rewards]);

  return (
    <div className="homepage">
      <div className="tile-large events-tile">
        <h2>Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="carousel">
            <h3>{events[currentEventIndex].title}</h3>
            <p>{events[currentEventIndex].description}</p>
            <p><strong>Category:</strong> {events[currentEventIndex].category}</p>
          </div>
        ) : (
          <p>No events available</p>
        )}
      </div>

      <div className="tile-medium rewards-tile">
        <h2>Available Rewards</h2>
        {rewards.length > 0 ? (
          <div className="carousel">
            <h3>{rewards[currentRewardIndex].title}</h3>
            <img src={rewards[currentRewardIndex].imageUrl} alt={rewards[currentRewardIndex].title} />
            <p>{rewards[currentRewardIndex].description}</p>
            <p><strong>Points Required:</strong> {rewards[currentRewardIndex].points}</p>
          </div>
        ) : (
          <p>No rewards available</p>
        )}
      </div>

      <div className="tile-small greeting-tile">
        <h2>Hello, {user.firstName}!</h2>
      </div>

      <div className="tile-small points-tile">
        <h2>Your Points: <span>{user.points}</span></h2>
      </div>
    </div>
  );
};

export default Home;
