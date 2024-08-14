import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Tooltip, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import { Edit, Delete, Add, WorkspacePremium } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import emailjs from 'emailjs-com'; // Import EmailJS

// EmailJS public key (replace with your actual key)
const EMAILJS_PUBLIC_KEY = 'cjdyxWCfcHYahHas1';
emailjs.init(EMAILJS_PUBLIC_KEY);

function Achievements() {
    const [allAchievements, setAllAchievements] = useState([]);
    const [earnedAchievements, setEarnedAchievements] = useState([]);
    const [totalEarned, setTotalEarned] = useState(0);
    const [achievementCounts, setAchievementCounts] = useState({});
    const [userCount, setUserCount] = useState(0); // Total number of users
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('create');
    const [currentAchievement, setCurrentAchievement] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [newAchievement, setNewAchievement] = useState({ title: '', description: '', condition: '' });
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [achievementToDelete, setAchievementToDelete] = useState(null);
    const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedAchievement, setSelectedAchievement] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [conditionChecked, setConditionChecked] = useState(false);
    const { user } = useContext(UserContext);

    const validationSchema = yup.object({
        title: yup.string().required('Title is required'),
        description: yup.string().required('Description is required'),
        condition: yup.string().required('Condition is required'),
    });

    const formik = useFormik({
        initialValues: {
            title: dialogMode === 'edit' && currentAchievement ? currentAchievement.title : '',
            description: dialogMode === 'edit' && currentAchievement ? currentAchievement.description : '',
            condition: dialogMode === 'edit' && currentAchievement ? currentAchievement.condition : '',
            imageFile: dialogMode === 'edit' && currentAchievement ? currentAchievement.imageFile : ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (dialogMode === 'create') {
                    if (imageFile) {
                        values.imageFile = imageFile;
                    }
                    await http.post('/staffachievement', values);
                    toast.success('Achievement created successfully');
                } else if (dialogMode === 'edit' && currentAchievement) {
                    if (imageFile) {
                        values.imageFile = imageFile;
                    }
                    await http.put(`/staffachievement/${currentAchievement.id}`, values);
                    toast.success('Achievement updated successfully');
                }
                setIsDialogOpen(false);
                fetchData();
            } catch (error) {
                toast.error('Error creating/updating achievement');
            }
        },
        enableReinitialize: true,
    });

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

            // Fetch all users for awarding achievements
            if (user?.usertype === 'staff') {
                const usersRes = await http.get('/user/allUsers');
                console.log('Users Response:', usersRes.data);
                setAllUsers(usersRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const findEarnedAchievement = (achievementId) => {
        return earnedAchievements.find((ach) => ach.id === achievementId);
    };

    const handleDialogOpen = (mode, achievement = null) => {
        setDialogMode(mode);
        setCurrentAchievement(achievement);
        setNewAchievement({ title: achievement?.title || '', description: achievement?.description || '', condition: achievement?.condition || '' });
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleAwardDialogOpen = () => {
        setIsAwardDialogOpen(true);
        setSelectedUser('');
        setSelectedAchievement('');
        setConditionChecked(false);
    };

    const handleAwardDialogClose = () => {
        setIsAwardDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAchievement(prevState => ({ ...prevState, [name]: value }));
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((res) => setImageFile(res.data.filename))
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    toast.error('Failed to upload image.');
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

    const handleAward = () => {
        const achievementTitle = allAchievements.find(ach => ach.id === selectedAchievement)?.title || 'Achievement';
        const userEmail = selectedUser;

        http.post('/staffachievement/award', {
            userEmail,
            achievementId: selectedAchievement,
            conditionChecked
        })
            .then(() => {
                // Fetch user details to get first name
                http.get(`/user/userByEmail/${userEmail}`)
                    .then(response => {
                        const userLastName = response.data.lastName;
                        let salutation = ""
                        if (response.data.gender === 'Female') {
                            salutation = 'Mrs.';
                        } else {
                            salutation = 'Mr.';
                        }

                        // Send email notification via EmailJS
                        emailjs.send('service_ktmad4e', 'template_5vf2vow', {
                            userEmail,
                            achievementTitle,
                            userLastName, // Include first name in the data sent to EmailJS
                            salutation
                        })
                            .then(() => {
                                toast.success('Achievement awarded and email sent successfully!');
                            })
                            .catch((error) => {
                                console.error('Error sending email:', error);
                                toast.error('Achievement awarded, but error sending email: ' + error.message);
                            });
                    })
                    .catch((error) => {
                        console.error('Error fetching user details:', error);
                        toast.error('Error awarding achievement and fetching user details: ' + error.message);
                    });

                handleAwardDialogClose();
            })
            .catch((error) => {
                console.error("Error awarding achievement:", error);
                toast.error('Error awarding achievement: ' + error.response.data.message);
            });
    };

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
                        {achievement.type !== "other" ? (
                            <img src={`/achievements/${achievement.imageFile}`} alt={achievement.title} style={{ maxWidth: '100%', borderRadius: '170px' }} />
                        ) : (
                            <img src={`${import.meta.env.VITE_FILE_BASE_URL}${achievement.imageFile}`} alt={achievement.title} style={{ maxWidth: '100%', borderRadius: '170px' }} />
                        )}
                        {/* <img src={`/achievements/${achievement.imageFile}`} alt={achievement.title} style={{ maxWidth: '100%', borderRadius: '170px' }} /> */}
                        <Typography variant="h6" align="center">{achievement.title}</Typography>
                        <Typography variant="body2" align="center" color="textSecondary">
                            {achievement.description}
                        </Typography>
                        {user?.usertype === 'staff' && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="caption">
                                    No.  of users earned: {achievementCounts[achievement.id] || 0}
                                </Typography>
                                <Box>
                                    <IconButton color="secondary" onClick={() => handleDialogOpen('edit', achievement)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(achievement.id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}
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
                <Box>

                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleDialogOpen('create')}>
                        Add Achievement
                    </Button>
                    <Button variant="contained" color="secondary" sx={{ ml: 2 }} startIcon={<WorkspacePremium />} onClick={handleAwardDialogOpen}>
                        Award Achievement
                    </Button>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                        Total Achievements Earned: {totalEarned || 0}
                    </Typography>
                </Box>
            )}
            <Grid container spacing={2}>
                {allAchievements.map((achievement) => (
                    <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                        {user?.usertype === 'staff' ? (
                            <Box>
                                {renderUserActions(achievement)}
                            </Box>
                        ) : renderUserActions(achievement)}
                    </Grid>
                ))}
            </Grid>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{dialogMode === 'create' ? 'Create Achievement' : 'Edit Achievement'}</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            margin="dense"
                            name="condition"
                            label="Condition"
                            type="text"
                            fullWidth
                            value={formik.values.condition}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.condition && Boolean(formik.errors.condition)}
                            helperText={formik.touched.condition && formik.errors.condition}
                        />
                        <Button variant="contained" component="label" sx={{ mt: 2 }}>
                            Upload Image
                            <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                        </Button>
                        {
                            imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                    <img
                                        alt="achievement"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    />
                                </Box>
                            )
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button type="submit">
                            {dialogMode === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </DialogActions>
                </form>
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
            <Dialog open={isAwardDialogOpen} onClose={handleAwardDialogClose}>
                <DialogTitle>Award Achievement</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select User</InputLabel>
                        <Select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            {allUsers.filter((user) => user.usertype !== 'staff').map((user) => (
                                <MenuItem key={user.email} value={user.email}>
                                    {user.email}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Achievement</InputLabel>
                        <Select value={selectedAchievement} onChange={(e) => setSelectedAchievement(e.target.value)}>
                            {allAchievements.map(ach => (
                                <MenuItem key={ach.id} value={ach.id}>{ach.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={<Checkbox checked={conditionChecked} onChange={(e) => setConditionChecked(e.target.checked)} />}
                            label={`Meets Condition: ${allAchievements.find(ach => ach.id === selectedAchievement)?.condition || "Select an achievement to view it's condition"}`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAwardDialogClose}>Cancel</Button>
                    <Button onClick={handleAward} color="primary">Award</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Achievements;
