import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, Button, Select, MenuItem,
    IconButton
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
            }
        } catch (error) {
            console.error('Error getting redemptions:', error);
        }
    };

    useEffect(() => {
        getRedemptions();
    }, [user]);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Redemptions</Typography>
            {user?.usertype === 'staff' && (
                <Box display="flex" mb={3}>
                    <TextField
                        label="Filter by Reward Title"
                        value={rewardTitle}
                        onChange={(e) => setRewardTitle(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label="Filter by User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2 }}
                    />
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        variant="outlined"
                        sx={{ mr: 2 }}
                    >
                        <MenuItem value="redeemedAt">Redeemed At</MenuItem>
                        <MenuItem value="rewardTitle">Reward Title</MenuItem>
                        <MenuItem value="userName">User Name</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </Select>
                </Box>
            )}
            <Box display="flex" mb={3}>
                <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    variant="outlined"
                    sx={{ mr: 2 }}
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Collected">Collected</MenuItem>
                    <MenuItem value="Expired">Expired</MenuItem>
                </Select>
                <Select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="DESC">Descending</MenuItem>
                    <MenuItem value="ASC">Ascending</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getRedemptions}
                    sx={{ ml: 2 }}
                >
                    Filter
                </Button>
            </Box>

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
