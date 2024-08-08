import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search, Clear, AccountCircle, AccessTime, Edit, Delete } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Participants() {
    const [participantList, setParticipantList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getParticipants = () => {
        http.get('/participant')
            .then((res) => {''
                console.log('Participants fetched:', res.data);
                setParticipantList(res.data);
            })
            .catch((error) => {
                console.error('Error fetching participants:', error);
            });
    };

    const searchParticipants = () => {
        if (search.trim() === '') {
            return;
        }
        http.get(`/participant?search=${encodeURIComponent(search)}`)
            .then((res) => {
                console.log('Participants searched:', res.data);
                setParticipantList(res.data);
            })
            .catch((error) => {
                console.error('Error searching participants:', error);
            });
    };

    useEffect(() => {
        getParticipants();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchParticipants();
        }
    };

    const onClickSearch = () => {
        searchParticipants();
    };

    const onClickClear = () => {
        setSearch('');
        getParticipants();
    };

    const deleteParticipant = (id) => {
        if (window.confirm('Are you sure you want to delete this participant?')) {
            http.delete(`/participant/${id}`)
                .then(() => {
                    setParticipantList(participantList.filter(participant => participant.id !== id));
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
                        {participantList.map((participant) => (
                            <TableRow key={participant.id}>
                                <TableCell>{participant.id}</TableCell>
                                <TableCell>{participant.firstName}</TableCell>
                                <TableCell>{participant.lastName}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.gender}</TableCell>
                                <TableCell>{new Date(participant.birthday).toLocaleDateString()}</TableCell>
                                <TableCell>{participant.event}</TableCell>
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
                                        <IconButton color="primary" sx={{ padding: '4px' }}>
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
