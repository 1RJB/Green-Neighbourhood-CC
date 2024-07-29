import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Participants() {
    const [participantList, setParticipantList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getParticipants = () => {
        http.get('/participant')
            .then((res) => {
                console.log('Participants fetched:', res.data);
                setParticipantList(res.data);
            })
            .catch(error => {
                console.error('Error fetching participants:', error);
            });
    };

    const searchParticipants = () => {
        http.get(`/participant?search=${search}`)
            .then((res) => {
                console.log('Participants searched:', res.data);
                setParticipantList(res.data);
            })
            .catch(error => {
                console.error('Error searching participants:', error);
            });
    };

    useEffect(() => {
        getParticipants();
    }, []); // Fetch participants on component mount

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

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Participants
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
                {
                    user && (
                        <Link to="/addparticipant" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' color='primary'>
                                Add
                            </Button>
                        </Link>
                    )
                }
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
                            <TableCell style={{ minWidth: 150 }}>Created At</TableCell>
                            <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            participantList.map((participant) => (
                                <TableRow key={participant.id}>
                                    <TableCell>{participant.id}</TableCell>
                                    <TableCell>{participant.Fname}</TableCell>
                                    <TableCell>{participant.Lname}</TableCell>
                                    <TableCell>{participant.email}</TableCell>
                                    <TableCell>{participant.gender}</TableCell>
                                    <TableCell>{dayjs(participant.birthday).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{participant.event}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>{participant.user?.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>{dayjs(participant.createdAt).format(global.datetimeFormat)}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            user && user.id === participant.userId && (
                                                <Link to={`/editparticipant/${participant.id}`}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Participants;
