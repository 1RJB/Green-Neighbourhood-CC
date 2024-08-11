import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Tooltip, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Achievements() {
    const [allAchievements, setAllAchievements] = useState([]);
    const [earnedAchievements, setEarnedAchievements] = useState([]);
    const [totalEarned, setTotalEarned] = useState(0);
    const [achievementCounts, setAchievementCounts] = useState({});
    const [userCount, setUserCount] = useState(0); // Total number of users
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('create');
    const [currentAchievement, setCurrentAchievement] = useState(null);
    const [newAchievement, setNewAchievement] = useState({ title: '', description: '', type: '', imageFile: '', condition: '' });
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [achievementToDelete, setAchievementToDelete] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all achievements
                const achievementsRes = await http.get('/staffachievement');
                console.log('Achievements Response:', achievementsRes.data);
                const achievements = achievementsRes.data;
                setAllAchievements(achievements);

                // Fetch user count
                const userCountRes = await http.get('/user/count');
                console.log('User Count Response:', userCountRes.data);
                setUserCount(userCountRes.data.count);

                // Fetch total earned achievements count for all users
                const totalAchievementsRes = await http.get('/staffachievement/totalcount');
                console.log('Total Achievements Response:', totalAchievementsRes.data);
                setTotalEarned(totalAchievementsRes.data.totalAchievements);

                // Fetch earned achievements counts (this should be available to everyone)
                try {
                    const countsRes = await http.get('/staffachievement/counts');
                    console.log('Achievement Counts Response:', countsRes.data);
                    setAchievementCounts(countsRes.data);
                } catch (err) {
                    console.error('Error fetching achievement counts:', err);
                }

                // Fetch earned achievements for users if not staff
                if (user?.usertype !== 'staff') {
                    const earnedRes = await http.get('/achievement');
                    console.log('Earned Achievements Response:', earnedRes.data);
                    setEarnedAchievements(earnedRes.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [user]);

    const findEarnedAchievement = (achievementId) => {
        return earnedAchievements.find((ach) => ach.id === achievementId);
    };

    const handleDialogOpen = (mode, achievement = null) => {
        setDialogMode(mode);
        setCurrentAchievement(achievement);
        setNewAchievement({ title: achievement?.title || '', description: achievement?.description || '', type: achievement?.type || '', imageFile: achievement?.imageFile || '', condition: achievement?.condition || '' });
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAchievement(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateOrUpdate = () => {
        const achievementData = { ...newAchievement, condition: JSON.parse(newAchievement.condition) }; // Convert JSON string to object
        if (dialogMode === 'create') {
            http.post('/staffachievement', achievementData)
                .then((res) => {
                    setAllAchievements([...allAchievements, res.data]);
                    handleDialogClose();
                })
                .catch((error) => {
                    console.error("Error creating achievement:", error);
                });
        } else if (dialogMode === 'edit' && currentAchievement) {
            http.put(`/staffachievement/${currentAchievement.id}`, achievementData)
                .then((res) => {
                    setAllAchievements(allAchievements.map(ach => ach.id === currentAchievement.id ? res.data : ach));
                    handleDialogClose();
                })
                .catch((error) => {
                    console.error("Error updating achievement:", error);
                });
        }
    };

    const handleDelete = (id) => {
        const achievement = allAchievements.find((ach) => ach.id === id);
        setAchievementToDelete({ id, title: achievement.title });
        setIsConfirmDialogOpen(true);
    };

    const confirmDelete = () => {
        http.delete(`/staffachievement/${achievementToDelete.id}`)
            .then(() => {
                setAllAchievements(allAchievements.filter(ach => ach.id !== achievementToDelete.id));
                setIsConfirmDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error deleting achievement:", error);
            });
    };

    const renderAdminActions = (achievement) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton color="primary" onClick={() => handleDialogOpen('edit', achievement)}>
                <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(achievement.id)}>
                <Delete />
            </IconButton>
        </Box>
    );

    const renderUserActions = (achievement) => {
        const earnedCount = achievementCounts[achievement.id] || 0;
        const percentage = userCount > 0 ? ((earnedCount / userCount) * 100).toFixed(2) : 0;
        return (
            <Tooltip title={
                <>
                    <Typography variant="h6">{achievement.title}</Typography>
                    <Typography>{achievement.description}</Typography>
                    {user?.usertype !== 'staff' && (
                        <Typography variant="caption">
                            {findEarnedAchievement(achievement.id) ? `Earned on: ${new Date(findEarnedAchievement(achievement.id).createdAt).toLocaleDateString()}` : 'Not Earned'}
                        </Typography>
                    )}
                    <Typography variant="caption">
                        <br /> {percentage}% of users have earned this achievement
                    </Typography>
                </>
            } arrow>
                <Card sx={{
                    cursor: 'pointer',
                    filter: user?.usertype === 'staff' ? 'none' : (findEarnedAchievement(achievement.id) ? 'none' : 'grayscale(100%)'),
                    '&:hover': {
                        transform: user?.usertype === 'staff' || findEarnedAchievement(achievement.id) ? 'scale(1.05)' : 'none',
                        transition: user?.usertype === 'staff' || findEarnedAchievement(achievement.id) ? 'transform 0.3s ease-in-out' : 'none',
                    },
                }}>
                    <CardContent>
                        <img src={`/achievements/${achievement.imageFile}`} alt={achievement.title} style={{ maxWidth: '100%', borderRadius: '170px' }} />
                    </CardContent>
                </Card>
            </Tooltip>
        );
    };

    return (
        <Box>
            <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                Achievements
            </Typography>
            {user?.usertype === 'staff' && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Total Achievements Earned: {totalEarned || 0}
                    </Typography>
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleDialogOpen('create')}>
                        Add Achievement
                    </Button>
                </Box>
            )}
            <Grid container spacing={2}>
                {allAchievements.map((achievement) => (
                    <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                        {user?.usertype === 'staff' ? (
                            <Box>
                                {renderAdminActions(achievement)}
                                <Typography variant="subtitle2">
                                    Earned: {achievementCounts[achievement.id] || 0} times
                                </Typography>
                                {renderUserActions(achievement)}
                            </Box>
                        ) : renderUserActions(achievement)}
                    </Grid>
                ))}
            </Grid>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{dialogMode === 'create' ? 'Create Achievement' : 'Edit Achievement'}</DialogTitle>
                <DialogContent>
                    <TextField name="title" label="Title" fullWidth margin="normal" value={newAchievement.title} onChange={handleInputChange} />
                    <TextField name="description" label="Description" fullWidth margin="normal" value={newAchievement.description} onChange={handleInputChange} />
                    <TextField name="type" label="Type" fullWidth margin="normal" value={newAchievement.type} onChange={handleInputChange} />
                    <TextField name="imageFile" label="Image File" fullWidth margin="normal" value={newAchievement.imageFile} onChange={handleInputChange} />
                    <TextField name="condition" label="Condition (JSON)" fullWidth margin="normal" value={newAchievement.condition} onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleCreateOrUpdate}>
                        {dialogMode === 'create' ? 'Create' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the achievement "{achievementToDelete?.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Achievements;
