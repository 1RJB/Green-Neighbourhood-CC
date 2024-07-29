import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const events = [
    'Tree Planting',
    'Beach Cleanup',
    'Recycling Workshop',
    'Wildlife Conservation',
    'Community Garden'
];

function EditParticipant() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [participant, setParticipant] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthday: '',
        event: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/participant/${id}`).then((res) => {
            setParticipant(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: {
            firstName: participant.firstName,
            lastName: participant.lastName,
            email: participant.email,
            gender: participant.gender,
            birthday: participant.birthday,
            event: participant.event
        },
        validationSchema: yup.object({
            firstName: yup.string().trim()
                .min(3, 'First name must be at least 3 characters')
                .max(100, 'First name must be at most 100 characters')
                .required('First name is required'),
            lastName: yup.string().trim()
                .min(3, 'Last name must be at least 3 characters')
                .max(100, 'Last name must be at most 100 characters')
                .required('Last name is required'),
            email: yup.string().trim()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
            gender: yup.string().trim()
                .oneOf(['male', 'female'], 'Gender must be either male or female')
                .required('Gender is required'),
            birthday: yup.date()
                .required('Birthday is required'),
            event: yup.string().trim()
                .required('Event is required')
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            http.put(`/participant/${id}`, values)
                .then((res) => {
                    console.log(res.data);
                    navigate('/participants');
                })
                .catch((error) => {
                    console.error('Update error:', error);
                    toast.error('Failed to update participant');
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteParticipant = () => {
        http.delete(`/participant/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate('/participants');
            })
            .catch((error) => {
                console.error('Delete error:', error);
                toast.error('Failed to delete participant');
            });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Participant
            </Typography>
            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <FormControl fullWidth margin="dense" error={formik.touched.gender && Boolean(formik.errors.gender)}>
                                <InputLabel htmlFor="gender">Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                                {formik.touched.gender && <Typography color="error">{formik.errors.gender}</Typography>}
                            </FormControl>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Birthday"
                                name="birthday"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.birthday}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                                helperText={formik.touched.birthday && formik.errors.birthday}
                            />
                            <FormControl fullWidth margin="dense" error={formik.touched.event && Boolean(formik.errors.event)}>
                                <InputLabel htmlFor="event">Event</InputLabel>
                                <Select
                                    label="Event"
                                    name="event"
                                    value={formik.values.event}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                >
                                    <MenuItem value="">Select Event</MenuItem>
                                    {events.map((event) => (
                                        <MenuItem key={event} value={event}>{event}</MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.event && <Typography color="error">{formik.errors.event}</Typography>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Participant
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this participant?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteParticipant}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}

export default EditParticipant;
