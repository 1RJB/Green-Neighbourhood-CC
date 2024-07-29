import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Search, Clear, CalendarMonth, Star } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import CustomerContext from '../contexts/CustomerContext';

function Rewards() {
    const [rewardList, setRewardList] = useState([]);
    const [search, setSearch] = useState('');
    const { customer } = useContext(CustomerContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRewards = () => {
        http.get('/reward').then((res) => {
            setRewardList(res.data);
        });
    };

    const searchRewards = () => {
        http.get(`/reward?search=${search}`).then((res) => {
            setRewardList(res.data);
        });
    };

    useEffect(() => {
        getRewards();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRewards();
        }
    };

    const onClickSearch = () => {
        searchRewards();
    }

    const onClickClear = () => {
        setSearch('');
        getRewards();
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Rewards
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
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
                <Box sx={{ flexGrow: 1 }} />
                {
                    customer && (
                        <Link to="/points-info">
                            <Button variant='contained'>
                            My Points: {customer.points}
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
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {reward.title}
                                            </Typography>
                                            <Star sx={{ mr: 1 }} color="primary" />
                                            <Typography>
                                                Points: {reward.points}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'left', mb: 1 }}
                                            color="text.secondary">
                                            <CalendarMonth sx={{ mr: 1 }} />
                                            <Typography sx={{ mr: 1 }}>
                                                Start Date: {dayjs(reward.startDate).format("D MMMM YYYY")}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'left', mb: 1 }}
                                            color="text.secondary">
                                            <CalendarMonth sx={{ mr: 1 }} />
                                            <Typography>
                                                End Date: {dayjs(reward.endDate).format("D MMMM YYYY")}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {reward.description}
                                        </Typography>
                                    </CardContent>
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