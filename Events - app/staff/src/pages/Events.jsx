import React, { useEffect, useState, useContext } from 'react';
import StaffContext from '../contexts/StaffContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, CalendarToday, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Events() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');
    const { staff } = useContext(StaffContext);
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
    useEffect(() => {
        getEvents();
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };
    const onClickSearch = () => {
        searchEvents();
    }
    const onClickClear = () => {
        setSearch('');
        getEvents();
    };
    useEffect(() => {
        http.get('/event').then((res) => {
            console.log(res.data);
            setEventList(res.data);
        });
    }, []);
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
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
                {/* if you log in and u can see the add button */}
                {/* based on who logs in you can determine to show edit/add button */}
                {
                    staff && (
                        <Link to="/addevent" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    eventList.map((event, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
                                <Card>
                                    {
                                        event.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="event"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {event.title}
                                            </Typography>
                                            {/* if you log in and u can see the edit button */}
                                            {/* based on who logs in you can determine to show edit/add button */}
                                            {
                                                staff && staff.id === event.staffId && (
                                                    <Link to={`/editevent/${event.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }

                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {event.staff?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <CalendarToday sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(event.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {event.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    )
}

export default Events;
