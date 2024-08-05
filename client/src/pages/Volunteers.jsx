import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, LocationOn, Event, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Adjust locale as needed
import UserContext from '../contexts/UserContext';

function Volunteers() {
    const [volunteerList, setVolunteerList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        getVolunteers();
    }, []);

    const getVolunteers = () => {
        http.get('/volunteer')
            .then((res) => {
                setVolunteerList(res.data);
                console.log(res.data);
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

    function formatTime(time) {
        let date = new Date("1970-01-01 " + time);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
      }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Volunteer Events
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
                            {volunteer.uploadPhoto && (
                                <Box className="aspect-ratio-container">
                                    <img
                                        alt="volunteer"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${volunteer.uploadPhoto}`}
                                    />
                                </Box>
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {volunteer.title}
                                    </Typography>
                                    {user && user.id === volunteer.userId && (
                                        <Link to={`/edit-volunteer/${volunteer.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>{volunteer.user?.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccessTime sx={{ mr: 1 }} />
                                    <Typography>
                                        {formatTime(volunteer.timeAvailable)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <Event sx={{ mr: 1 }} />
                                    <Typography>{dayjs(volunteer.date).format('DD MMM YYYY')}</Typography>
                                </Box>
                                


                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Volunteers;
