import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, IconButton, SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import http from '../http';
import './pages.css'; // Import the CSS file

const LeaderBoard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRank, setUserRank] = useState(-1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await http.get('/user/top20Users');
                setLeaderboard(data);

                // Fetch current user data
                const { data: currentUserData } = await http.get('/user/userauth');
                setCurrentUser(currentUserData.user);

                // Determine user's rank
                const rank = data.findIndex(user => user.id === currentUserData.user.id);
                setUserRank(rank);

                // Show Snackbar if user is in the top 3
                if (rank >= 0 && rank < 3) {
                    setSnackbarOpen(true);
                }
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err.response?.data || err.message);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRowStyles = (index) => {
        const isCurrentUser = currentUser && leaderboard[index]?.id === currentUser.id;
        const isTop3 = index < 3;

        return {
            backgroundColor: isTop3 ? (index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32') : '#fff',
            color: isTop3 ? '#fff' : '#000',
            border: isCurrentUser && isTop3 ? '3px solid #000' : 'none', // Outline if current user in top 3
            fontWeight: isCurrentUser ? 'bold' : 'normal',
        };
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box className="leaderboard">
            <Typography variant="h4" gutterBottom>
                Leaderboard
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="leaderboard table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((user, index) => (
                            <TableRow key={user.id} sx={getRowStyles(index)}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell align="right">{user.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                autoHideDuration={60000} // Auto-hide after 60 seconds
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    m: 2,
                }}
            >
                <SnackbarContent
                    className="MuiSnackbarContent-root"
                    message={`Congratulations ${currentUser?.firstName}! You are ranked #${userRank + 1} on the leaderboard.`}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleSnackbarClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
            </Snackbar>
        </Box>
    );
};

export default LeaderBoard;
