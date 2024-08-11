import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Event, Search, Clear } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import UserContext from '../contexts/UserContext';

function formatTime24to12(time24hr) {
    const [hours, minutes] = time24hr.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return format(date, 'hh:mm a');
}

function StaffVolunteer() {
    const [volunteerList, setVolunteerList] = useState([]);
    const [search, setSearch] = useState('');
    const [userMap, setUserMap] = useState({});
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        getVolunteers();
        fetchUsers();
    }, []);

    useEffect(() => {
        http.get('/user/userInfo', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }).then((res) => {
            setUser(res.data);
        }).catch(error => {
            console.error("Failed to fetch user data:", error);
        });
    }, [setUser]);

    const getVolunteers = () => {
        http.get('/volunteer')
            .then((res) => {
                setVolunteerList(res.data);
            })
            .catch((error) => console.error('Error fetching volunteers:', error));
    };

    const fetchUsers = () => {
        http.get('/user/allUsers')
            .then((res) => {
                const users = res.data.reduce((map, user) => {
                    map[user.id] = user;
                    return map;
                }, {});
                setUserMap(users);
            })
            .catch((error) => console.error('Error fetching users:', error));
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

    const getFullName = (userId) => {
        const user = userMap[userId];
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                All Volunteer Tickets
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
            </Box>
            <Grid container spacing={2}>
                {volunteerList.length > 0 ? (
                    volunteerList.map((volunteer) => (
                        <Grid item xs={12} md={6} lg={4} key={volunteer.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {volunteer.title}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>{getFullName(volunteer.userId)}</Typography>
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
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            component={Link}
                                            to={`/ticketdetails/${volunteer.id}`}
                                            variant="contained"
                                            color="primary"
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No volunteers found.</Typography>
                )}
            </Grid>
        </Box>
    );
}

export default StaffVolunteer;
