import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function EditParticipant() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [participant, setParticipant] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthday: '',
        event: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);
    const [eventList, setEventList] = useState([]);

    useEffect(() => {
        // Fetch participant data
        http.get(`/participant/${id}`).then((res) => {
            setParticipant(res.data);
            setLoading(false);
        });

        // Fetch event titles from the database
        http.get('/event').then((res) => {
            setEventList(res.data);
        }).catch((error) => {
            console.error('Error fetching events:', error);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: {
            firstName: participant.firstName,
            lastName: participant.lastName,
            email: participant.email,
            gender: participant.gender,
            birthday: participant.birthday,
            event: participant.event,
            status: participant.status
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
                .oneOf(['Male', 'Female'], 'Gender must be either male or female')
                .required('Gender is required'),
            birthday: yup.date()
                .required('Birthday is required'),
            event: yup.string().trim()
                .required('Event is required'),
            status: yup.string().trim()
                .required('Status is required')
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
                                disabled
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
                                disabled
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
                                disabled
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
                                    disabled
                                >
                                    <MenuItem value="">Select Gender</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
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
                                disabled
                            />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Event"
                                    name="event"
                                    value={formik.values.event}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled
                                />
                            <FormControl fullWidth margin="dense" error={formik.touched.status && Boolean(formik.errors.status)}>
                                <InputLabel htmlFor="status">Status</InputLabel>
                                <Select
                                    label="Status"
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                    placeholder='Select Status'
                                >
                                    <MenuItem value="Joined">Joined</MenuItem>
                                    <MenuItem value="Participated">Participated</MenuItem>
                                </Select>
                                {formik.touched.status && <Typography color="error">{formik.errors.status}</Typography>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                    </Box>
                </Box>
            )}

            <ToastContainer />
        </Box>
    );
}

export default EditParticipant;
