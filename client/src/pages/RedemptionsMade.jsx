import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem } from '@mui/material';
import http from '../http';

function RedemptionsMade() {
    const [redemptions, setRedemptions] = useState([]);
    const [rewardId, setRewardId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [sortBy, setSortBy] = useState('redeemedAt');
    const [order, setOrder] = useState('DESC');

    useEffect(() => {
        fetchRedemptions();
    }, [rewardId, customerId, sortBy, order]);

    const fetchRedemptions = async () => {
        try {
            const res = await http.get('/reward/redemptionsmade', { params: { rewardId, customerId, sortBy, order } });
            setRedemptions(res.data);
        } catch (error) {
            console.error('Error fetching redemptions:', error.response?.data || error.message);
        }
    };
    
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Redemptions</Typography>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <TextField
                    label="Filter by Reward ID"
                    value={rewardId}
                    onChange={(e) => setRewardId(e.target.value)}
                    variant="outlined"
                    style={{ marginRight: '1rem' }}
                />
                <TextField
                    label="Filter by Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    variant="outlined"
                    style={{ marginRight: '1rem' }}
                />
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    variant="outlined"
                    style={{ marginRight: '1rem' }}
                >
                    <MenuItem value="redeemedAt">Redeemed At</MenuItem>
                    <MenuItem value="rewardId">Reward ID</MenuItem>
                    <MenuItem value="customerId">Customer ID</MenuItem>
                </Select>
                <Select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="DESC">Descending</MenuItem>
                    <MenuItem value="ASC">Ascending</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={fetchRedemptions} style={{ marginLeft: '1rem' }}>
                    Filter
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Reward Title</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Customer Email</TableCell>
                            <TableCell>Redeemed At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {redemptions.map((redemption) => (
                            <TableRow key={redemption.id}>
                                <TableCell>{redemption.Reward.title}</TableCell>
                                <TableCell>{redemption.Customer.name}</TableCell>
                                <TableCell>{redemption.Customer.email}</TableCell>
                                <TableCell>{new Date(redemption.redeemedAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default RedemptionsMade;
