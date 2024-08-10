import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Select, MenuItem } from '@mui/material';
import { CalendarToday, Search, Clear, Edit, AccessTime } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import http from '../http';
import global from '../global';
import './Events.css';

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
    const [timeFilter, setTimeFilter] = useState('All');
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const onTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const getEvents = () => {
        let url = '/event';
        if (search || selectedCategory !== 'All') {
            url += `?search=${search}`;
            if (selectedCategory !== 'All') {
                url += `&category=${selectedCategory}`;
            }
        }
        http.get(url).then((res) => {
            const now = dayjs();
            const twoMonthsFromNow = now.add(2, 'month');
            const oneMonthFromNow = now.add(1, 'month');
            const filteredEvents = res.data.filter(event => {
                const eventDate = dayjs(event.eventDate);

                if (timeFilter === 'Upcoming') {
                    return eventDate.isAfter(twoMonthsFromNow);
                } else if (timeFilter === 'Current') {
                    return eventDate.isBetween(now, oneMonthFromNow);
                } else if (timeFilter === 'Past') {
                    return dayjs(event.endDate).isBefore(now);
                } else {
                    return true; // If 'All', return all events
                }
            });

            setEventList(filteredEvents);
        }).catch((error) => {
            console.error("Error fetching events:", error);
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
        setTimeFilter('All');
        getEvents();
    };

    const handleViewDetails = (event) => {
        navigate(`/viewevent/${event.id}`);
    };

    const getEventType = (event) => {
        const now = dayjs();
        const startDate = dayjs(event.eventDate);
        const endDate = dayjs(event.endDate);

        if (startDate.isAfter(now.add(2, 'months'))) {
            return 'upcoming';
        } else if (endDate.isBefore(now)) {
            return 'past';
        } else {
            return 'current'; // Fallback
        }
    };

    const getEventTypeLabel = (event) => {
        const type = getEventType(event);
        switch (type) {
            case 'upcoming':
                return 'Upcoming';
            case 'current':
                return 'Current';
            case 'past':
                return 'Past';
            default:
                return '';
        }
    };

    const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length <= 20) {
            return description;
        }
        return words.slice(0, 20).join(' ') + '...';
    };

    useEffect(() => {
        getEvents();
    }, [search, selectedCategory, timeFilter]); // Re-fetch events when search, category, or time filter changes

    return (
        <Box>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 10 }}>
                Events
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="black" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="black" onClick={onClickClear}>
                    <Clear />
                </IconButton>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', mb: 2, mr: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16, mb: 1 }}>
                        EVENT TYPE
                    </Typography>
                    <Select
                        value={selectedCategory}
                        onChange={onCategoryChange}
                        sx={{ width: 200, height: 45 }}
                    >
                        <MenuItem value="All">All Categories</MenuItem>
                        {Object.keys(categoryColors).map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16, mb: 1 }}>
                        TIME FILTER
                    </Typography>
                    <Select
                        value={timeFilter}
                        onChange={onTimeFilterChange}
                        sx={{ width: 200, height: 45 }}
                    >
                        <MenuItem value="All">All Time</MenuItem>
                        <MenuItem value="Upcoming">Upcoming</MenuItem>
                        <MenuItem value="Current">Current</MenuItem>
                        <MenuItem value="Past">Past Events</MenuItem>
                    </Select>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                {user && user.usertype === "staff" && (
                    <Link to="/addevent" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">Add</Button>
                    </Link>
                )}
            </Box>

            <Grid container spacing={2}>
                {eventList.map((event) => {
                    const now = dayjs();
                    const eventDate = dayjs(event.eventDate);

                    return (
                        <Grid item xs={12} md={6} lg={4} key={event.id} sx={{ mb: 5 }}>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" className={`category-pill category-${categoryColors[event.category]}`}>
                                                {event.category}
                                            </Typography>
                                            <Typography variant="body2" className={`event-type-pill event-type-${getEventType(event)}`}>
                                                {getEventTypeLabel(event)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {event.title}
                                            </Typography>
                                            {user && user.usertype === "staff" && user.id === event.staffId && (
                                                <Link to={`/editevent/${event.id}`}>
                                                    <IconButton color="black" sx={{ padding: '20px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <CalendarToday sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(event.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <CalendarToday sx={{ mr: 1 }}/>
                                            <Typography>
                                                {event.endDate && event.endTime ? dayjs(`${event.endDate} ${event.endTime}`).format(global.datetimeFormat) : 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">

                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                            {truncateDescription(event.description)}
                                        </Typography>
                                        <Button onClick={() => handleViewDetails(event)} variant="outlined">
                                            View Details
                                        </Button>
                                    </CardContent>
                                </div>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <ToastContainer />
        </Box>
    );
}

export default Events;
