import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Event, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs'; // Ensure this import is included
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserContext from '../contexts/UserContext';

function Volunteers() {
    const [volunteerList, setVolunteerList] = useState([]);
    const [search, setSearch] = useState('');
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getVolunteers();
    }, []);

    useEffect(() => {
        // Fetch user info from the /userInfo endpoint
        http.get('/user/userInfo', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }).then((res) => {
            setUser(res.data);
            setLoading(false);
        }).catch(error => {
            console.error("Failed to fetch user data:", error);
            setLoading(false);
            toast.error("Failed to load user data.");
        });
    }, [setUser]);

    const getVolunteers = () => {
        http.get('/volunteer')
            .then((res) => {
                setVolunteerList(res.data);
            })
            .catch((error) => console.error('Error fetching volunteers:', error));
    };

    const searchVolunteers = () => {
        http.get(`/volunteer?search=${search}`)
            .then((res) => setVolunteerList(res.data))
            .catch((error) => console.error('Error searching volunteers:', error));
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchVolunteers();
        }
    };

    const onClickSearch = () => {
        searchVolunteers();
    };

    const onClickClear = () => {
        setSearch('');
        getVolunteers();
    };

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'N/A';

    function formatTime24to12(time24hr) {
        const [hours, minutes] = time24hr.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return format(date, 'hh:mm a');
    }
    
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Tickets
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {user && (
                    <Link to="/add-volunteer">
                        <Button variant="contained">Add</Button>
                    </Link>
                )}
            </Box>
            <Grid container spacing={2}>
                {volunteerList.map((volunteer) => (
                    <Grid item xs={12} md={6} lg={4} key={volunteer.id}>
                        <Card>
                        <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {volunteer.title}
                                    </Typography>
                                    <Link to={`/edit-volunteer/${volunteer.id}`}>
                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>{volunteer.userName || 'Unknown User'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccessTime sx={{ mr: 1 }} />
                                    <Typography>
                                        {formatTime24to12(volunteer.timeAvailable)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <Event sx={{ mr: 1 }} />
                                    <Typography>{dayjs(volunteer.dateAvailable).format('DD MMM YYYY')}</Typography>
                                </Box>
                                <Box sx={{ mb: 1 }} color="text.secondary">
                                    <Typography><strong>Service Type:</strong> {volunteer.serviceType}</Typography>
                                </Box>
                                <Box sx={{ mb: 1 }} color="text.secondary">
                                    <Typography><strong>Comments:</strong> {volunteer.comments}</Typography>
                                </Box>
                                <Box sx={{ mb: 1 }} color="text.secondary">
                                    <Typography><strong>Duration:</strong> {volunteer.duration} hours</Typography>
                                </Box>
                                <Box sx={{ mb: 1 }} color="text.secondary">
                                    <Typography><strong>Contact Info:</strong> {volunteer.contactInfo}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <ToastContainer />
        </Box>
    );
}

export default Volunteers;
