import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Select, MenuItem } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, CalendarMonth, Numbers, Star, ArrowForward } from '@mui/icons-material';
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
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
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Log the user and userType to the console for debugging
    console.log("User Object:", user);
    console.log("User Type:", user ? user.usertype : "No user object");

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
            setRewardList(res.data);
        }).catch((error) => {
            console.error("Error fetching rewards:", error);
        });
    };

    useEffect(() => {
        getRewards();
    }, [selectedCategory, search]);

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

    const handleRedemption = (reward) => {
        if (user) {
            navigate('/redeem', { state: { reward: reward.title } });
        } else {
            toast.error("Please log in to redeem rewards.");
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
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
                {
                    user && user.usertype === "staff" && (
                        <>
                            <Link to="/reward/redemptions">
                                <Button variant='contained'>
                                    Redemptions
                                </Button>
                            </Link>
                            <Link to="/addreward">
                                <Button variant='contained' sx={{ ml: 2 }}>
                                    Add
                                </Button>
                            </Link>
                        </>
                    )
                }
                {
                    user && user.usertype === "user" && (
                        <Link to="/points-info">
                            <Button variant='contained'>
                                My Points: {user.points}
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    rewardList.map((reward, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={reward.id}>
                                <Link to={`/reward/redeem/${reward.id}`} style={{ textDecoration: 'none' }}>
                                    <Card>
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
                                                                <IconButton color="primary" sx={{ padding: '4px' }}>
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
                                                    (!user || user.usertype !== "staff") && (
                                                        <>
                                                            <Typography textAlign={'center'} fontSize={15} color="primary" >
                                                                <Star sx={{ mr: 1 }} color="primary" />
                                                                {reward.points} points
                                                            </Typography>
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
                                                                <Star sx={{ mr: 1 }} />
                                                                <Typography>
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
        </Box >
    );
}

export default Rewards;
