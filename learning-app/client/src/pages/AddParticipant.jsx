import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import events from '../events'; // Adjust the path as necessary

function AddParticipant() {
    const [autoFillEnabled, setAutoFillEnabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            email: "",
            gender: "",
            birthday: "",
            event: ""
        },
        validationSchema: yup.object({
            fname: yup.string().trim()
                .min(3, 'First name must be at least 3 characters')
                .max(50, 'First name must be at most 50 characters')
                .required('First name is required'),
            lname: yup.string().trim()
                .min(3, 'Last name must be at least 3 characters')
                .max(50, 'Last name must be at most 50 characters')
                .required('Last name is required'),
            email: yup.string().email('Invalid email address')
                .required('Email is required'),
            gender: yup.string().oneOf(['Male', 'Female'], 'Invalid gender')
                .required('Gender is required'),
            birthday: yup.date()
                .required('Birthday is required'),
            event: yup.string()
                .required('Event is required')
        }),
        onSubmit: (data) => {
            data.fname = data.fname.trim();
            data.lname = data.lname.trim();
            http.post("/participant", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/participants");
                });
        }
    });
    
    useEffect(() => {
        if (autoFillEnabled) {
            // Assuming you have a method to check if the user is logged in and fetch their data
            const userData = getUserDataIfLoggedIn();
            if (userData) {
                formik.setValues({
                    ...formik.values,
                    fname: userData.fname,
                    lname: userData.lname,
                    email: userData.email,
                    gender: userData.gender,
                    birthday: userData.birthday,

                });
            }
        }
    }, [autoFillEnabled]);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Participant
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="First Name"
                            name="fname"
                            value={formik.values.fname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fname && Boolean(formik.errors.fname)}
                            helperText={formik.touched.fname && formik.errors.fname}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Last Name"
                            name="lname"
                            value={formik.values.lname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lname && Boolean(formik.errors.lname)}
                            helperText={formik.touched.lname && formik.errors.lname}
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
