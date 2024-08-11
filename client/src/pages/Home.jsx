import React, { useEffect, useState, useContext } from 'react';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import './pages.css'; // Import the CSS file for styles
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [rewards, setRewards] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [userCount, setUserCount] = useState(0);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
    const navigate = useNavigate();

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
                const { data } = await http.get('/achievement/withnotice');
                if (data.length > 0) {
                    await http.put('/achievement/resetnotices');
                    toast.success("Congrats, you got a new achievement! You can view it on the Achievements page.");
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
            }
        };

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
        }, 5000);

        const rewardInterval = setInterval(() => {
            setCurrentRewardIndex((prevIndex) => (rewards.length > 0 ? (prevIndex + 1) % rewards.length : 0));
        }, 3000);

        return () => {
            clearInterval(eventInterval);
            clearInterval(rewardInterval);
        };
    }, [events, rewards]);

    const handleVolunteerClick = () => {
        if (user && user.usertype === 'volunteer') {
            navigate('/volunteers');
        } else {
            navigate(user?.usertype === 'staff' ? '/staff/volunteers' : '/');
        }
    };

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
        <div className="homepage">
            <div className="welcome-section">
                <h1 className="display-4 text-center">Welcome {user?.firstName || 'Guest'} to the Green Community!</h1>
            </div>
            <div className="middle-nav">
                <div className="points-box">
                    {user && user.usertype === "user" && (
                        <>
                            <h4>Your Points</h4>
                            <p>You have <strong>{user?.points || 0}</strong> points.</p>
                        </>
                    )}
                </div>
                <div className="rewards-tile">
                    <h4>Rewards</h4>
                    {rewards.length > 0 ? (
                        <div className="d-flex flex-wrap">
                            {getVisibleRewards().map((reward) => (
                                <div key={reward.id} className="reward-item mx-2 text-center">
                                    <img
                                        alt={reward.title}
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                                        className="img-fluid rounded"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <div className="reward-title">{reward.title}</div> {/* Title for hover effect */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No rewards available</p>
                    )}
                </div>
                <div className="volunteer-section">
                    <h4 className="volunteer-title">Lets lend a helping hand</h4>
                    <p className="volunteer-para">
                        🌿 Make a Difference: Help your community and create positive change.
                        <br></br>
                        🌱 Gain Skills: Develop valuable skills and experience.
                        <br></br>
                        🚶‍♂️ Build Connections: Meet new people and expand your network.
                        <br></br>
                        💧 Boost Well-being: Enhance mental health and find personal fulfillment.
                        <br></br>
                        🌿 Improve Your Resume: Add impressive experience to your career profile.
                    </p>
                    
                </div>

            </div>
            <div className="homepage-grid">
                <div className="events-tile">
                    <h4 className="card-title">Upcoming Events</h4>
                    {events.length > 0 ? (
                        <div id="eventCarousel" className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                {events.map((event, index) => (
                                    <div className={`carousel-item ${index === currentEventIndex ? 'active' : ''}`} key={event.id}>
                                        <img
                                            className="d-block w-100 rounded"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                                            alt={event.title}
                                        />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5>{event.title}</h5>
                                            <p>{event.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>No events available</p>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Home;
