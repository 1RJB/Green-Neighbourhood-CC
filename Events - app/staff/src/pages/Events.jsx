import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, CalendarToday, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import './Events.css'; // Import CSS for Events component styling

// Define category colors mapping
const categoryColors = {
    Sustainable: 'green',
    Sports: 'red',
    Community: 'blue',
    Workshop: 'brown',
    Others: 'navy',
};

function Events() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    // Log the user and userType to the console for debugging
    console.log("User Object:", user);
    console.log("User Type:", user ? user.usertype : "No user object");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEvents = () => {
        http.get('/event').then((res) => {
            setEventList(res.data);
        });
    };

    const searchEvents = () => {
        http.get(`/event?search=${search}`).then((res) => {
            setEventList(res.data);
        });
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };

    const onClickSearch = () => {
        searchEvents();
    };

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
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
                {user && user.usertype === "staff" && (
                    <Link to="/addevent" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">
                            Add
                        </Button>
                    </Link>
                )}
            </Box>

            <Grid container spacing={2}>
                {eventList.map((event, i) => (
                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                        <Card>
                            <div className="event-card-content">
                                <div className="event-image-container">
                                    {event.imageFile && (
                                        <img
                                            alt="event"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                                            className="event-image"
                                        />
                                    )}
                                </div>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                        <Typography variant="body2" className={`category-pill category-${categoryColors[event.category]}`}>
                                            {event.category}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {event.title}
                                        </Typography>
                                        {user && user.usertype === "staff" && user.id === event.staffId && (
                                            <Link to={`/editevent/${event.id}`}>
                                                <IconButton color="primary" sx={{ padding: '20px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>
                                            {event.user?.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <CalendarToday sx={{ mr: 1 }} />
                                        <Typography>
                                            {dayjs(event.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <Typography variant="body2">
                                            Category: {event.category}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {event.description}
                                    </Typography>
                                </CardContent>
                            </div>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Events;
