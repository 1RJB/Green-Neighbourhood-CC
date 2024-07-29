import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function AddParticipant() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [autoFillEnabled, setAutoFillEnabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            birthday: "",
            event: ""
        },
        validationSchema: yup.object({
            firstName: yup
                .string()
                .trim()
                .min(3, "First Name must be at least 3 characters")
                .max(25, "First Name must be at most 25 characters")
                .required("First Name is required")
                .matches(
                    /^[a-zA-Z '-,.]+$/,
                    "First Name only allows letters, spaces, and characters: ' - , ."
                ),
            lastName: yup
                .string()
                .trim()
                .min(3, "Last Name must be at least 3 characters")
                .max(25, "Last Name must be at most 25 characters")
                .required("Last Name is required")
                .matches(
                    /^[a-zA-Z '-,.]+$/,
                    "Last Name only allows letters, spaces, and characters: ' - , ."
                ),
            email: yup
                .string()
                .trim()
                .email("Enter a valid email")
                .max(50, "Email must be at most 50 characters"),
            gender: yup
                .string()
                .oneOf(["Male", "Female"], "Gender must be either Male or Female")
                .required("Gender is required"),
            birthday: yup.date()
                .required('Birthday is required'),
            event: yup.string()
                .required('Event is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await http.post("/participant/register", {
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    email: values.email.trim().toLowerCase(),
                    birthday: values.birthday,
                    gender: values.gender,
                    event: values.event
                });
                console.log("Participation successful:", response.data);
                navigate("/event");
            } catch (error) {
                toast.error(`${error.response.data.message}`);
            }
        },
    });

    useEffect(() => {
        if (autoFillEnabled && user) {
            formik.setValues({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                birthday: user.birthday,
                event: ""
            });
        }
    }, [autoFillEnabled, user]);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Participant
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={4}>
                        {user && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={autoFillEnabled}
                                        onChange={(e) => setAutoFillEnabled(e.target.checked)}
                                    />
                                }
                                label="Use my profile information"
                            />
                        )}
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
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Birthday"
                            name="birthday"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formik.values.birthday}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                            helperText={formik.touched.birthday && formik.errors.birthday}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="event-label">Event</InputLabel>
                            <Select
                                labelId="event-label"
                                name="event"
                                value={formik.values.event}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.event && Boolean(formik.errors.event)}
                            >
                                {/* Assuming `events` is an array of event objects */}
                                {events.map((event) => (
                                    <MenuItem key={event.id} value={event.id}>{event.name}</MenuItem>
                                ))}
                            </Select>
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

export default AddParticipant;
