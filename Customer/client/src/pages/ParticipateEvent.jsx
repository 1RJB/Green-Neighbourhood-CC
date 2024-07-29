// src/pages/ParticipateEvent.jsx
import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function ParticipateEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext); // Get user from context
    const [autoFill, setAutoFill] = useState(false); // State for checkbox

    // Retrieve event title from location state
    const eventTitle = location.state?.event || '';

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            birthday: "",
            event: eventTitle
        },
        validationSchema: yup.object({
            firstName: yup.string().trim().min(3).max(25).required('First name is required'),
            lastName: yup.string().trim().min(3).max(25).required('Last name is required'),
            email: yup.string().trim().email('Invalid email format').max(50).nullable(),
            gender: yup.string().trim().oneOf(['Male', 'Female'], 'Gender is required').required('Gender is required'),
            birthday: yup.date().required('Birthday is required'),
            event: yup.string().trim().required('Event is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await http.post("/participant/participate", {
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    email: values.email.trim().toLowerCase(),
                    gender: values.gender,
                    birthday: values.birthday,
                    event: values.event
                });
                console.log("Participation successful!", response.data);
                toast.success("Participation successful!");
                navigate("/events");
            } catch (error) {
                console.error("API error:", error);
                if (error.response && error.response.data && error.response.data.errors) {
                    toast.error(error.response.data.errors.join(', '));
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            }
        },
    });

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setAutoFill(isChecked);

        if (isChecked && user) {
            formik.setValues({
                firstName: user.name,
                lastName: user.lname,
                email: user.email,
                gender: user.gender,
                birthday: user.birthday,
                event: eventTitle
            });
        } else {
            formik.resetForm();
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Participate in Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        {user && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={autoFill}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Use my profile information"
                            />
                        )}
                        <TextField
                            fullWidth
                            margin="dense"
                            label="First Name"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Email (Optional)"
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
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
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
