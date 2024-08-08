import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, Button, Select, MenuItem,
    IconButton, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@mui/material';
import http from '../http';
import { Link } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';

const Redemptions = () => {
    const [redemptionList, setRedemptionList] = useState([]);
    const [rewardTitle, setRewardTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [sortBy, setSortBy] = useState('redeemedAt');
    const [status, setStatus] = useState('All');
    const [order, setOrder] = useState('DESC');
    const [open, setOpen] = useState(false); // Dialog open state
    const [selectedRedemption, setSelectedRedemption] = useState(null); // Selected redemption to delete

    const getRedemptions = async () => {
        try {
            console.log('Fetching redemptions...');
            const response = await http.get('/redemption', {
                params: {
                    rewardTitle: rewardTitle,
                    userName: userName,
                    sortBy: sortBy,
                    order: order,
                    status: status
                }
            });
            console.log(response); // Log entire response
            console.log(response.data); // Log response data

            if (response.data) {
                setRedemptionList(response.data);
            }
        } catch (error) {
            console.error('Error getting redemptions:', error);
        }
    };

    useEffect(() => {
        getRedemptions();
    }, []);

    const deleteRedemption = async () => {
        if (selectedRedemption) {
            try {
                await http.delete(`/redemption/${selectedRedemption.id}`);
                setRedemptionList(redemptionList.filter(redemption => redemption.id !== selectedRedemption.id));
                console.log(`Redemption with ID ${selectedRedemption.id} deleted successfully.`);
            } catch (error) {
                console.error('Error deleting redemption:', error);
            } finally {
                setOpen(false); // Close dialog after operation
                setSelectedRedemption(null); // Clear selected redemption
            }
        }
    };

    const handleOpen = (redemption) => {
        setSelectedRedemption(redemption);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRedemption(null);
    };

    console.log('redemptionList:', redemptionList);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Redemptions</Typography>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <TextField
                    label="Filter by Reward Name"
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
                    <MenuItem value="rewardTitle">Reward Name</MenuItem>
                    <MenuItem value="userName">User Name</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                </Select>

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
                            <TableCell>ID</TableCell>
                            <TableCell>Reward Title</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>User Email</TableCell>
                            <TableCell>Redeemed At</TableCell>
                            <TableCell>Collect By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {redemptionList.length > 0 ? redemptionList.map(({ id, reward, user, redeemedAt, collectBy, status }) => (
                            <TableRow key={id}>
                                <TableCell>{id}</TableCell>
                                <TableCell>{reward.title}</TableCell>
                                <TableCell>{user.firstName + ' ' + user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(redeemedAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(collectBy).toLocaleDateString()}</TableCell>
                                <TableCell>{status}</TableCell>
                                <TableCell>
                                    <Link to={`/reward/editredemption/${id}`}>
                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <IconButton variant="contained" color="error" sx={{ ml: 2 }} onClick={() => handleOpen({ id, reward, user })}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={8}>No redemptions made</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Redemption</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this redemption for {selectedRedemption?.reward.title} by user {selectedRedemption?.user.firstName} {selectedRedemption?.user.lastName} with Redemption ID {selectedRedemption?.id}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteRedemption}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Redemptions;
