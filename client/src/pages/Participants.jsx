import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search, Clear, AccountCircle, AccessTime, Edit, Delete } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Participants() {
    const [currentParticipants, setCurrentParticipants] = useState([]);
    const [pastParticipants, setPastParticipants] = useState([]);
    const [currentSearch, setCurrentSearch] = useState('');
    const [pastSearch, setPastSearch] = useState('');
    const [eventMap, setEventMap] = useState({});
    const { user } = useContext(UserContext);

    const onCurrentSearchChange = (e) => {
        setCurrentSearch(e.target.value);
    };

    const getEvents = async () => {
        try {
            const res = await http.get('/event');
            const map = {};
            res.data.forEach(event => {
                map[event.id] = event.title;
            });
            setEventMap(map);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const onPastSearchChange = (e) => {
        setPastSearch(e.target.value);
    };

    const getCurrentParticipants = async () => {
        try {
            const res = await http.get('/participant/currentEvents');
            console.log('Current participants fetched:', res.data);
            setCurrentParticipants(res.data);
        } catch (error) {
            console.error('Error fetching current participants:', error);
        }
    };

    const getPastParticipants = async () => {
        try {
            const res = await http.get('/participant/pastEvents');
            console.log('Past participants fetched:', res.data);
            setPastParticipants(res.data);
        } catch (error) {
            console.error('Error fetching past participants:', error);
        }
    };

    const searchCurrentParticipants = () => {
        if (currentSearch.trim() === '') {
            return;
        }
        http.get(`/participant/currentEvents?search=${encodeURIComponent(currentSearch)}`)
            .then((res) => {
                console.log('Current participants searched:', res.data);
                setCurrentParticipants(res.data);
            })
            .catch((error) => {
                console.error('Error searching current participants:', error);
            });
    };

    const searchPastParticipants = () => {
        if (pastSearch.trim() === '') {
            return;
        }
        http.get(`/participant/pastEvents?search=${encodeURIComponent(pastSearch)}`)
            .then((res) => {
                console.log('Past participants searched:', res.data);
                setPastParticipants(res.data);
            })
            .catch((error) => {
                console.error('Error searching past participants:', error);
            });
    };

    useEffect(() => {
        getEvents(); // Fetch events first
        getCurrentParticipants(); // Then fetch current participants
        getPastParticipants(); // Then fetch past participants
    }, []);

    const onCurrentSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchCurrentParticipants();
        }
    };

    const onPastSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchPastParticipants();
        }
    };

    const onCurrentClickSearch = () => {
        searchCurrentParticipants();
    };

    const onPastClickSearch = () => {
        searchPastParticipants();
    };

    const onCurrentClickClear = () => {
        setCurrentSearch('');
        getCurrentParticipants();
    };

    const onPastClickClear = () => {
        setPastSearch('');
        getPastParticipants();
    };

    const deleteParticipant = (id) => {
        if (window.confirm('Are you sure you want to delete this participant?')) {
            http.delete(`/participant/${id}`)
                .then(() => {
                    setCurrentParticipants(currentParticipants.filter(participant => participant.id !== id));
                    setPastParticipants(pastParticipants.filter(participant => participant.id !== id));
                    console.log(`Participant with ID ${id} deleted successfully.`);
                })
                .catch((error) => {
                    console.error('Error deleting participant:', error);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Participants
            </Typography>

            {/* Current Participants Table */}
            <Typography variant="h6" sx={{ my: 2 }}>
                Current Participants
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={currentSearch}
                    placeholder="Search"
                    onChange={onCurrentSearchChange}
                    onKeyDown={onCurrentSearchKeyDown}
                />
                <IconButton color="primary" onClick={onCurrentClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onCurrentClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ minWidth: 50 }}>ID</TableCell>
                            <TableCell style={{ minWidth: 120 }}>First Name</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Last Name</TableCell>
                            <TableCell style={{ minWidth: 200 }}>Email</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Gender</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Birthday</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Event</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Created By</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Status</TableCell>
                            <TableCell style={{ minWidth: 150 }}>Created At</TableCell>
                            <TableCell style={{ minWidth: 150 }}>Updated At</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentParticipants.map((participant) => (
                            <TableRow key={participant.id}>
                                <TableCell>{participant.id}</TableCell>
                                <TableCell>{participant.firstName}</TableCell>
                                <TableCell>{participant.lastName}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.gender}</TableCell>
                                <TableCell>{new Date(participant.birthday).toLocaleDateString()}</TableCell>
                                <TableCell>{eventMap[participant.eventId]}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>{participant.user?.firstName + " " + participant.user?.lastName || 'Unknown'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{participant.status}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>{new Date(participant.createdAt).toLocaleString()}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>{new Date(participant.updatedAt).toLocaleString()}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {user.usertype === 'staff' && (
                                        <Link to={`/editparticipant/${participant.id}`}>
                                            <IconButton color="secondary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    )}
                                    {user.usertype === 'user' && (
                                        <IconButton color="error" sx={{ padding: '4px' }} onClick={() => deleteParticipant(participant.id)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Past Participants Table */}
            <Typography variant="h6" sx={{ my: 2 }}>
                Past Participants
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={pastSearch}
                    placeholder="Search"
                    onChange={onPastSearchChange}
                    onKeyDown={onPastSearchKeyDown}
                />
                <IconButton color="secondary" onClick={onPastClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="secondary" onClick={onPastClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ minWidth: 50 }}>ID</TableCell>
                            <TableCell style={{ minWidth: 120 }}>First Name</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Last Name</TableCell>
                            <TableCell style={{ minWidth: 200 }}>Email</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Gender</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Birthday</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Event</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Created By</TableCell>
                            <TableCell style={{ minWidth: 120 }}>Status</TableCell>
                            <TableCell style={{ minWidth: 150 }}>Created At</TableCell>
                            <TableCell style={{ minWidth: 150 }}>Updated At</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pastParticipants.map((participant) => (
                            <TableRow key={participant.id}>
                                <TableCell>{participant.id}</TableCell>
                                <TableCell>{participant.firstName}</TableCell>
                                <TableCell>{participant.lastName}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.gender}</TableCell>
                                <TableCell>{new Date(participant.birthday).toLocaleDateString()}</TableCell>
                                <TableCell>{eventMap[participant.eventId]}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>{participant.user?.firstName + " " + participant.user?.lastName || 'Unknown'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{participant.status}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>{new Date(participant.createdAt).toLocaleString()}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>{new Date(participant.updatedAt).toLocaleString()}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {user.usertype === 'staff' && (
                                        <Link to={`/editparticipant/${participant.id}`}>
                                            <IconButton color="secondary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    )}
                                    {user.usertype === 'user' && (
                                        <IconButton color="error" sx={{ padding: '4px' }} onClick={() => deleteParticipant(participant.id)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Participants;
