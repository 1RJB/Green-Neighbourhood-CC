import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, FormControl, InputLabel, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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
                    setModalMessage('Participant deleted successfully.');
                    setModalOpen(true);
                    console.log(`Participant with ID ${id} deleted successfully.`);
                })
                .catch((error) => {
                    console.error('Error deleting participant:', error);
                });
        }
    };

    // Modal close handler
    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <Box className="container mt-4">
            <Typography variant="h5" sx={{ my: 2 }}>
                Participants
            </Typography>

            {/* Current Participants Table */}
            <Typography variant="h6" sx={{ my: 2 }}>
                Current Participants
            </Typography>

            <Box className="mb-3 d-flex align-items-center">
                <FormControl className="me-2">
                    <InputLabel htmlFor="currentSearch">Search</InputLabel>
                    <Input
                        id="currentSearch"
                        value={currentSearch}
                        onChange={onCurrentSearchChange}
                        onKeyDown={onCurrentSearchKeyDown}
                    />
                </FormControl>
                <IconButton color="primary" onClick={onCurrentClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="secondary" onClick={onCurrentClickClear}>
                    <Clear />
                </IconButton>
            </Box>

            <TableContainer component={Paper}>
                <Table className="table table-striped">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Birthday</TableCell>
                            <TableCell>Event</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
                            <TableCell>Actions</TableCell>
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

            <Box className="mb-3 d-flex align-items-center">
                <FormControl className="me-2">
                    <InputLabel htmlFor="pastSearch">Search</InputLabel>
                    <Input
                        id="pastSearch"
                        value={pastSearch}
                        onChange={onPastSearchChange}
                        onKeyDown={onPastSearchKeyDown}
                    />
                </FormControl>
                <IconButton color="primary" onClick={onPastClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="secondary" onClick={onPastClickClear}>
                    <Clear />
                </IconButton>
            </Box>

            <TableContainer component={Paper}>
                <Table className="table table-striped">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Birthday</TableCell>
                            <TableCell>Event</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Updated At</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for messages */}
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Message</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Participants;
