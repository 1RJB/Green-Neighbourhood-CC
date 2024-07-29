import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ParticipateEvent() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve event title from location state
    const eventTitle = location.state?.event || '';

    const formik = useFormik({
        initialValues: {
            Fname: '',
            Lname: '',
            email: '',
            gender: '',
            birthday: '',
            event: eventTitle
        },
        validationSchema: yup.object({
            Fname: yup.string().trim().min(3).max(100).required('First name is required'),
            Lname: yup.string().trim().min(3).max(100).required('Last name is required'),
            email: yup.string().trim().email('Invalid email format').max(100).required('Email is required'),
            gender: yup.string().trim().oneOf(['male', 'female'], 'Gender is required').required('Gender is required'),
            birthday: yup.date().required('Birthday is required'),
            event: yup.string().trim().required('Event is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await http.post('/participant', values);
                console.log(response.data);
                navigate('/');
            } catch (error) {
                console.error(error);
                toast.error('Failed to add participant');
            }
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Participate in Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="First Name"
                            name="Fname"
                            value={formik.values.Fname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Fname && Boolean(formik.errors.Fname)}
                            helperText={formik.touched.Fname && formik.errors.Fname}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Last Name"
                            name="Lname"
                            value={formik.values.Lname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Lname && Boolean(formik.errors.Lname)}
                            helperText={formik.touched.Lname && formik.errors.Lname}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <FormControl fullWidth margin="dense" error={formik.touched.gender && Boolean(formik.errors.gender)}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value="">Select Gender</MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </Select>
                            {formik.touched.gender && <Typography color="error">{formik.errors.gender}</Typography>}
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="dense"
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
                        <FormControl fullWidth margin="dense">
                            <TextField
                                fullWidth
                                label="Event"
                                name="event"
                                value={formik.values.event}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.event && Boolean(formik.errors.event)}
                                helperText={formik.touched.event && formik.errors.event}
                                disabled
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default ParticipateEvent;
