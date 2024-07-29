import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Select, MenuItem } from '@mui/material';
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
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user } = useContext(UserContext);

    // Log the user and userType to the console for debugging
    console.log("User Object:", user);
    console.log("User Type:", user ? user.usertype : "No user object");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const getEvents = () => {
        let url = '/event';
        if (search || selectedCategory !== 'All') {
            url += `?search=${search}`;
            if (selectedCategory !== 'All') {
                url += `&category=${selectedCategory}`;
            }
        }
        console.log("Fetching events with URL:", url); // Log the URL for debugging
        http.get(url).then((res) => {
            console.log("Events data:", res.data); // Log the response data
            setEventList(res.data);
        }).catch((error) => {
            console.error("Error fetching events:", error); // Log any errors
        });
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            getEvents();
        }
    };

    const onClickSearch = () => {
        getEvents();
    };

    const onClickClear = () => {
        setSearch('');
        setSelectedCategory('All');
        getEvents();
    };

    useEffect(() => {
        getEvents();
    }, [search, selectedCategory]); // Re-fetch events when search or category changes
    
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
                <Select
                    value={selectedCategory}
                    onChange={onCategoryChange}
                    sx={{ mx: 2 }}
                >
                    <MenuItem value="All">All Categories</MenuItem>
                    {Object.keys(categoryColors).map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
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
                                            {event.staff ? `${event.staff.firstName} ${event.staff.lastName}` : "Unknown Staff"}{event.user?.name}
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
