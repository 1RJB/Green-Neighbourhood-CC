import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Select, MenuItem, LinearProgress } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, CalendarMonth, Numbers, Forest, ArrowForward, Add, ViewArray, EmojiEvents } from '@mui/icons-material';
import http from '../http';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import './pages.css';

// Define category colors mapping
const categoryColors = {
    Vouchers: "green",
    Gift_Cards: "lightgreen",
    Health_And_Wellness: "orange",
    Workshops: "purple",
    Career_Development: "blue",
    Recognition: "red",
    Others: "grey"
};

function Rewards() {
    const [rewardList, setRewardList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user, setUser } = useContext(UserContext); // Assuming setUser exists in UserContext
    const navigate = useNavigate();

    // Function to fetch user data
    const fetchUserData = () => {
        http.get('/user/userInfo').then((res) => {
            console.log("Fetched user data:", res.data);
            setUser(res.data); // Update user data in context
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };

    useEffect(() => {
        if (user)
            fetchUserData(); // Fetch user data on mount
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        getRewards();
    }, [search, selectedCategory]);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const getRewards = () => {
        let url = '/reward';
        if (search || selectedCategory !== 'All') {
            url += '?';
            if (search) {
                url += `search=${search}`;
            }
            if (selectedCategory !== 'All') {
                url += `${search ? '&' : ''}category=${selectedCategory}`;
            }
        }
        console.log("Fetching rewards with URL:", url);
        http.get(url).then((res) => {
            console.log("Rewards data:", res.data);
            const currentDate = dayjs();
            const filteredRewards = res.data.filter(reward => {
                if (user && user.usertype === "staff") {
                    return true; // Show all rewards to staff
                }
                return dayjs(reward.endDate).isAfter(currentDate);
            });
            setRewardList(filteredRewards);
        }).catch((error) => {
            console.error("Error fetching rewards:", error);
        });
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            getRewards();
        }
    };

    const onClickSearch = () => {
        getRewards();
    }

    const onClickClear = () => {
        setSearch('');
        setSelectedCategory('All');
        getRewards();
    }

    return (
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>
                Rewards
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Select
                    value={selectedCategory}
                    onChange={onCategoryChange}
                    sx={{ mx: 2 }}
                >
                    <MenuItem value="All">All Categories</MenuItem>
                    {Object.keys(categoryColors).map((category) => (
                        <MenuItem key={category} value={category}>
                            {category.replace(/_/g, ' ')}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/leaderboard">
                    <Button variant="contained" startIcon={<EmojiEvents />} color="primary">
                        View Leaderboard
                    </Button>
                </Link>
                {
                    user && user.usertype === "staff" && (
                        <>
                            <Link to="/reward/redemptions">
                                <Button variant='contained' startIcon={<ViewArray />} color="secondary" sx={{ ml: 2 }}>
                                    View Redemptions
                                </Button>
                            </Link>
                            <Link to="/addreward">
                                <Button variant='contained' startIcon={<Add />} sx={{ ml: 2 }}>
                                    Add Reward
                                </Button>
                            </Link>
                        </>
                    )
                }
                {
                    user && user.usertype === "user" && (
                        <Link to="/points-info">
                            <Button variant='contained' sx={{ ml: 2 }}>
                                My Points: {user.points}
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    rewardList.map((reward, i) => {
                        const isExpired = dayjs().isAfter(dayjs(reward.endDate));
                        const isUpcoming = dayjs().isBefore(dayjs(reward.startDate));
                        const isMaxRedeemed = reward.redemptionCount === reward.maxTotalRedeem;
                        return (
                            <Grid item xs={12} md={6} lg={4} key={reward.id}>

                                <Link to={`/reward/redeem/${reward.id}`} style={{ textDecoration: 'none' }}>
                                    <Card className={
                                        (isExpired && user && user.usertype === "staff") ? "expired-reward" :
                                            (isMaxRedeemed && user && user.usertype === "staff") ? "max-redeemed-reward" :
                                                (isUpcoming) ? "upcoming-reward" : ""
                                    }>
                                        {isExpired && user && user.usertype === "staff" && (
                                            <div className="expired-label">Expired</div>
                                        )}
                                        {isUpcoming && (
                                            <div className="upcoming-label">Upcoming</div>
                                        )}
                                        {isMaxRedeemed && user && user.usertype === "staff" && (
                                            <div className="max-redeemed-label">Max Redeemed</div>
                                        )}
                                        <div className="pages-card-content">

                                            {
                                                reward.imageFile && (
                                                    <Box className="aspect-ratio-container">
                                                        <img alt="reward"
                                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}>
                                                        </img>
                                                    </Box>
                                                )
                                            }

                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                                    <Typography variant="body2" className={`category-pill category-${categoryColors[reward.category]}`}>
                                                        {reward.category.replace(/_/g, ' ')}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }} textAlign={'center'} fontSize={17}>
                                                        {reward.title}
                                                    </Typography>
                                                    {
                                                        user && user.usertype === "staff" && (
                                                            <Link to={`/editreward/${reward.id}`}>
                                                                <IconButton color="primary" sx={{ padding: '4px', mt: 2.5 }}>
                                                                    <Edit />
                                                                </IconButton>
                                                            </Link>
                                                        )
                                                    }


                                                </Box>
                                                {
                                                    user && user.usertype === "staff" && (
                                                        <>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                                color="text.secondary">
                                                                <AccountCircle sx={{ mr: 1 }} />
                                                                <Typography>
                                                                    {reward.staff ? `${reward.staff.firstName} ${reward.staff.lastName}` : "Unknown Staff"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                                color="text.secondary">
                                                                <AccessTime sx={{ mr: 1 }} />
                                                                <Typography>
                                                                    {dayjs(reward.createdAt).format(global.datetimeFormat)}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    )
                                                }
                                                {
                                                    user && user.usertype === "user" && (
                                                        <>
                                                            {
                                                                user.points < reward.points ? (
                                                                    <Box sx={{ width: '70%', margin: '0 auto', mt: 3 }}>
                                                                        <LinearProgress variant="determinate" value={(user.points / reward.points) * 100} sx={{ borderRadius: 5 }} />
                                                                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', fontSize: 14 }} color={'primary'}>
                                                                            {`${user.points} of ${reward.points} points`}
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <Typography textAlign={'center'} fontSize={14} color="primary" >
                                                                        <Forest sx={{ mr: 1 }} color="primary" />
                                                                        {reward.points} points
                                                                    </Typography>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                                {
                                                    user && user.usertype === "staff" && (
                                                        <>
                                                            <Box sx={{ display: 'flex', mt: 1, textAlign: 'center' }} color="text.secondary">
                                                                <CalendarMonth sx={{ mr: 1 }} />
                                                                <Typography sx={{ mr: 1 }}>
                                                                    {dayjs(reward.startDate).format("DD MMM YYYY")}
                                                                </Typography>
                                                                <ArrowForward />
                                                                <Typography sx={{ ml: 1 }}>
                                                                    {dayjs(reward.endDate).format("DD MMM YYYY")}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                                color="text.secondary">
                                                                <Forest sx={{ mr: 1, mt: 1 }} />
                                                                <Typography sx={{ mt: 1 }}>
                                                                    Points: {reward.points}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                                color="text.secondary">
                                                                <Numbers sx={{ mr: 1 }} />
                                                                <Typography>
                                                                    Max Redemptions Per User: {reward.maxEachRedeem}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                                color="text.secondary">
                                                                <Numbers sx={{ mr: 1 }} />
                                                                <Typography>
                                                                    Max Total Redemptions: {reward.maxTotalRedeem}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                                                {reward.description}
                                                            </Typography>
                                                        </>
                                                    )
                                                }

                                            </CardContent>
                                        </div>
                                    </Card>
                                </Link>
                            </Grid>
                        );
                    })
                }
            </Grid>

        </Box>

    );
}

export default Rewards;
