import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../http';
import UserContext from '../contexts/UserContext';

const participantSchema = yup.object().shape({
    firstName: yup.string().required('First name is required').min(3, 'First name must be at least 3 characters'),
    lastName: yup.string().required('Last name is required').min(3, 'Last name must be at least 3 characters'),
    email: yup.string().email('Invalid email format').nullable(),
    gender: yup.string().oneOf(['Male', 'Female'], 'Gender is required').required('Gender is required'),
    birthday: yup.date().max(new Date(), 'Birthday cannot be in the future').required('Birthday is required'),
});

function ParticipateEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const [participants, setParticipants] = useState([{
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthday: '',
        event: location.state?.event || ''
    }]);

    const handleAddParticipant = async () => {
        const currentIndex = participants.length - 1;
        const currentParticipant = participants[currentIndex];

        try {
            // Validate the current participant
            await participantSchema.validate(currentParticipant, { abortEarly: false });
            setParticipants([...participants, { firstName: '', lastName: '', email: '', gender: '', birthday: '', event: location.state?.event || '' }]);
            formik.setFieldValue(`participants`, [...participants, { firstName: '', lastName: '', email: '', gender: '', birthday: '', event: location.state?.event || '' }]);
        } catch (error) {
            // Handle validation errors
            error.inner.forEach((err) => {
                formik.setFieldError(`participants[${currentIndex}].${err.path}`, err.message);
            });
            toast.error("Please complete the current participant's form before adding a new one.");
        }
    };

    const handleRemoveParticipant = (index) => {
        const updatedParticipants = participants.filter((_, i) => i !== index);
        setParticipants(updatedParticipants);
        formik.setFieldValue('participants', updatedParticipants); // Update Formik state
    };

    const handleSubmit = async (values) => {
        try {
            const response = await http.post("/participant", { participants: values.participants });
            toast.success("Participation successful! " + response.data.message.join(" ")); // Display success messages
            navigate("/events");
        } catch (error) {
            console.error("API error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const formik = useFormik({
        initialValues: {
            participants, // Use the state directly for Formik's initialValues
        },
        validationSchema: yup.object({
            participants: yup.array().of(participantSchema), // Validation for each participant
        }),
        onSubmit: handleSubmit,
    });

    // Handle input changes to update Formik state
    const handleParticipantChange = (index, field) => (event) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index][field] = event.target.value;
        setParticipants(updatedParticipants);
        formik.setFieldValue('participants', updatedParticipants); // Update Formik state
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Participate in Event
            </Typography>
            {!user && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                    By logging in, you'll have the opportunity to earn points that can be redeemed for exciting rewards when you or your friends participate in events! 
                    <Link to="/login" style={{ color: '#1976d2', textDecoration: 'underline', marginLeft: '5px' }}>
                        Log in
                    </Link> now to get started!
                </Typography>
            )}
            <Box component="form" onSubmit={formik.handleSubmit}>
                {participants.map((participant, index) => (
                    <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Member {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="First Name"
                                    name={`participants[${index}].firstName`}
                                    value={participant.firstName}
                                    onChange={handleParticipantChange(index, 'firstName')}
                                    error={Boolean(formik.errors.participants?.[index]?.firstName)}
                                    helperText={formik.errors.participants?.[index]?.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Last Name"
                                    name={`participants[${index}].lastName`}
                                    value={participant.lastName}
                                    onChange={handleParticipantChange(index, 'lastName')}
                                    error={Boolean(formik.errors.participants?.[index]?.lastName)}
                                    helperText={formik.errors.participants?.[index]?.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Email (Optional)"
                                    name={`participants[${index}].email`}
                                    value={participant.email}
                                    onChange={handleParticipantChange(index, 'email')}
                                    error={Boolean(formik.errors.participants?.[index]?.email)}
                                    helperText={formik.errors.participants?.[index]?.email}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="dense" error={Boolean(formik.errors.participants?.[index]?.gender)}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name={`participants[${index}].gender`}
                                        value={participant.gender}
                                        onChange={handleParticipantChange(index, 'gender')}
                                    >
                                        <MenuItem value="">Select Gender</MenuItem>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                    {formik.errors.participants?.[index]?.gender && (
                                        <Typography color="error" variant="caption">{formik.errors.participants?.[index]?.gender}</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Birthday"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    name={`participants[${index}].birthday`}
                                    value={participant.birthday}
                                    onChange={handleParticipantChange(index, 'birthday')}
                                    error={Boolean(formik.errors.participants?.[index]?.birthday)}
                                    helperText={formik.errors.participants?.[index]?.birthday}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Event"
                                    value={participant.event}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        {/* Show Remove button only for members after the first */}
                        {index > 0 && (
                            <Button variant="outlined" color="error" onClick={() => handleRemoveParticipant(index)} sx={{ mt: 2 }}>
                                Remove
                            </Button>
                        )}
                    </Box>
                ))}
                <Button variant="outlined" onClick={handleAddParticipant}>
                    Add Another Participant
                </Button>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Participate
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default ParticipateEvent;
