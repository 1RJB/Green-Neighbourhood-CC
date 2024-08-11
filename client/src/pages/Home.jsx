import React, { useEffect, useState, useContext } from 'react';
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
        <div className="container mt-5" style={{ backgroundColor: '#eaf8ea', padding: '20px', borderRadius: '10px' }}>
            <div className="text-center mb-4">
                <h1 className="display-4 text-success">Welcome to Our Green Community!</h1>
                <p className="lead text-muted">Together, we can make a difference for the environment.</p>
            </div>
            <div className="row">
                {/* Big Tile - Events */}
                <div className="col-md-7 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
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
                                    <a className="carousel-control-prev" href="#eventCarousel" role="button" data-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                    <a className="carousel-control-next" href="#eventCarousel" role="button" data-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </div>
                            ) : (
                                <p>No events available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Medium Tile - Rewards */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h4 className="card-title">Rewards</h4>
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
                                            <h6 className="mt-2">{reward.title}</h6>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No rewards available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Welcome User Tile */}
                <div className="col-md-6 mb-4">
                    <div className="card bg-info text-white shadow-sm border-0">
                        <div className="card-body text-center">
                            <h4 className="card-title">Welcome, {user?.firstName || 'Guest'}!</h4>
                            <p className="card-text">Would you like to make a difference?</p>
                        </div>
                    </div>
                </div>

                {/* Points / User Count Tile */}
                <div className="col-md-5 mb-4">
                    <div className="card bg-warning text-white shadow-sm border-0">
                        <div className="card-body text-center">
                            {user && user.usertype === "user" && (
                                <>
                                    <h4 className="card-title">Your Points</h4>
                                    <p className="card-text">You have <strong>{user?.points || 0}</strong> points.</p>
                                </>
                            )}
                            {user && user.usertype === "staff" && (
                                <>
                                    <h4 className="card-title">Total Users</h4>
                                    <p className="card-text">We currently have <strong>{userCount || 0}</strong> users.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Environmentally Friendly Tips Tile */}
                <div className="col-12 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h4 className="card-title text-success">🌿 Go Green: Tips for a Sustainable Lifestyle</h4>
                            <p>Here are some simple ways you can help protect the environment:</p>
                            <ul className="list-unstyled text-success">
                                <li>🌱 Reduce, Reuse, and Recycle: Minimize waste by reusing items and recycling whenever possible.</li>
                                <li>🚶‍♂️ Walk or Bike: Opt for walking, biking, or public transport instead of driving to reduce carbon emissions.</li>
                                <li>💧 Save Water: Turn off the tap while brushing your teeth and fix leaks promptly.</li>
                                <li>🌍 Support Local: Buy from local farmers and businesses to reduce the carbon footprint from transportation.</li>
                                <li>🌿 Plant Trees: Participate in tree-planting events or plant trees in your community.</li>
                            </ul>
                            <p className="text-success">Join us in making a positive impact on our planet!</p>
                            <button className="btn btn-success mt-3" onClick={() => toast.info("Thank you for your commitment to the environment!")}>
                                Join the Movement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Home;
