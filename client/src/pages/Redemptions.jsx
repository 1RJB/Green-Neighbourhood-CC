import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Select, MenuItem,
    IconButton, Grid, FormControl, InputLabel, Autocomplete, TextField
} from '@mui/material';
import http from '../http';
import { Link } from 'react-router-dom';
import { Edit } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';

const Redemptions = () => {
    const [redemptionList, setRedemptionList] = useState([]);
    const [rewardTitle, setRewardTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [sortBy, setSortBy] = useState('redeemedAt');
    const [status, setStatus] = useState('All');
    const [order, setOrder] = useState('DESC');
    const [rewardOptions, setRewardOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const { user } = useContext(UserContext);

    const getRedemptions = async () => {
        try {
            let endpoint = '/redemption';
            let params = {
                rewardTitle,
                userName,
                sortBy,
                order,
                status
            };

            if (user?.usertype !== 'staff') {
                endpoint = '/redemption/user';
                params = { ...params, userId: user.id };
            }

            const response = await http.get(endpoint, { params });
            console.log(response.data);

            if (response.data) {
                setRedemptionList(response.data);
                const rewards = [...new Set(response.data.map((item) => item.reward.title))];
                const users = [...new Set(response.data.map((item) => item.user.firstName + ' ' + item.user.lastName))];
                setRewardOptions(rewards);
                setUserOptions(users);
            }
        } catch (error) {
            console.error('Error getting redemptions:', error);
        }
    };

    useEffect(() => {
        getRedemptions();
    }, [user]);

    // Automatically update results when filters change
    useEffect(() => {
        getRedemptions();
    }, [rewardTitle, userName, sortBy, status, order]);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Redemptions</Typography>
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                        options={rewardOptions}
                        value={rewardTitle}
                        onChange={(event, newValue) => setRewardTitle(newValue || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Filter by Reward Title" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>
                {user?.usertype === 'staff' && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            options={userOptions}
                            value={userName}
                            onChange={(event, newValue) => setUserName(newValue || '')}
                            renderInput={(params) => (
                                <TextField {...params} label="Filter by User Name" variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sort By"
                        >
                            <MenuItem value="redeemedAt">Redeemed At</MenuItem>
                            <MenuItem value="rewardTitle">Reward Title</MenuItem>
                            <MenuItem value="userName">User Name</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Collected">Collected</MenuItem>
                            <MenuItem value="Expired">Expired</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            label="Order"
                        >
                            <MenuItem value="DESC">Descending</MenuItem>
                            <MenuItem value="ASC">Ascending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {user?.usertype === 'staff' && <TableCell>ID</TableCell>}
                            <TableCell>Reward Title</TableCell>
                            {user?.usertype === 'staff' && <>
                                <TableCell>User Name</TableCell>
                                <TableCell>User Email</TableCell>
                            </>}
                            <TableCell>Redeemed At</TableCell>
                            <TableCell>Collect By</TableCell>
                            <TableCell>Status</TableCell>
                            {user?.usertype === 'staff' && <TableCell>Action</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {redemptionList.length > 0 ? redemptionList.map(({ id, reward, user: redemptionUser, redeemedAt, collectBy, status }) => (
                            <TableRow key={id}>
                                {user?.usertype === 'staff' && <TableCell>{id}</TableCell>}
                                <TableCell>{reward.title}</TableCell>
                                {user?.usertype === 'staff' && <>
                                    <TableCell>{redemptionUser.firstName + ' ' + redemptionUser.lastName}</TableCell>
                                    <TableCell>{redemptionUser.email}</TableCell>
                                </>}
                                <TableCell>{new Date(redeemedAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(collectBy).toLocaleDateString()}</TableCell>
                                <TableCell>{status}</TableCell>
                                {user?.usertype === 'staff' &&
                                    <TableCell>
                                        <Link to={`/reward/editredemption/${id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                }
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={user?.usertype === 'staff' ? 7 : 3} align="center">
                                    No redemptions made
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Redemptions;
