import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../http';
import UserContext from '../contexts/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const participantSchema = yup.object().shape({
    firstName: yup.string().required('First name is required').min(3, 'First name must be at least 3 characters'),
    lastName: yup.string().required('Last name is required').min(3, 'Last name must be at least 3 characters'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    gender: yup.string().oneOf(['Male', 'Female'], 'Gender is required').required('Gender is required'),
    birthday: yup.date().max(new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), 'Participant must be at least 5 years old').required('Birthday is required'),
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
        eventId: '', // Initialize with empty string for eventId
        createdBy: user.id,
    }]);
    const [eventTitle, setEventTitle] = useState('');
    const eventId = location.state?.event; // Get eventId from location state

    useEffect(() => {
        if (eventId) {
            // Fetch event details to get the event title
            http.get(`/event/${eventId}`)
                .then((res) => {
                    setEventTitle(res.data.title);
                    // Update participants with the eventId
                    setParticipants(prevParticipants => prevParticipants.map(p => ({ ...p, eventId })));
                })
                .catch((error) => {
                    console.error('Error fetching event details:', error);
                });
        }
    }, [eventId]);

    const handleAddParticipant = async () => {
        const currentIndex = participants.length - 1;
        const currentParticipant = participants[currentIndex];

        try {
            // Validate the current participant
            await participantSchema.validate(currentParticipant, { abortEarly: false });
            setParticipants([...participants, { firstName: '', lastName: '', email: '', gender: '', birthday: '', eventId, createdBy: user.id }]);
            formik.setFieldValue(`participants`, [...participants, { firstName: '', lastName: '', email: '', gender: '', birthday: '', eventId, createdBy: user.id }]);
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
            // Check for duplicate email addresses
            const emailSet = new Set(values.participants.map(p => p.email.trim().toLowerCase()));
            if (emailSet.size !== values.participants.length) {
                throw new Error('Duplicate email address found.');
            }

            // Create a map to track occurrences of each participant's unique combination
            const participantMap = new Map();
            const duplicates = [];

            values.participants.forEach(participant => {
                const key = `${participant.email.trim().toLowerCase()}-${participant.eventId}`;

                // Check if the combination already exists
                if (participantMap.has(key)) {
                    duplicates.push(`${participant.firstName} ${participant.lastName}`);
                } else {
                    participantMap.set(key, true);
                }
            });

            // If there are duplicates, throw an error
            if (duplicates.length > 0) {
                throw new Error(`${duplicates.join(', ')} ${duplicates.length > 1 ? 'are' : 'is'} already participating.`);
            }

            // Proceed to submit the form data to the backend
            const response = await http.post("/participant", { participants: values.participants });
            toast.success("Participation successful! " + response.data.message.join(" ")); // Display success messages
            if (response.data.achievementEarned) {
                toast.success("Congratulations! You've earned a new achievement!\n First Event Registration !");
            }
            // Delay navigation to allow toast to display
            setTimeout(() => {
                navigate("/events");
            }, 3000); // 3 seconds delay
        } catch (error) {
            // Clear any existing participants in case of error
            if (error.response && error.response.data && error.response.data.errors) {
                toast.error(error.response.data.errors); // Display the detailed error message from the backend
            } else if (error.message === 'Duplicate email address found.') {
                toast.error('Please use a different email for each participant.');
            } else if (error.message.includes('already participating')) {
                toast.error(error.message); // Display the detailed error message for already participating issue
            } else {
                console.error("API error:", error);
                toast.error("An error occurred. Please try again.");
            }
            // Ensure no participants are submitted if an error is detected
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

    // Handle autofill for the first participant
    const handleAutoFill = (event) => {
        const firstParticipant = participants[0];

        if (event.target.checked) {
            // Autofill with user information
            firstParticipant.firstName = user.firstName || '';
            firstParticipant.lastName = user.lastName || '';
            firstParticipant.email = user.email || '';
            firstParticipant.gender = user.gender || '';
            firstParticipant.birthday = user.birthday || ''; // Ensure you have birthday in the user context if needed
        } else {
            // Reset to empty values
            firstParticipant.firstName = '';
            firstParticipant.lastName = '';
            firstParticipant.email = '';
            firstParticipant.gender = '';
            firstParticipant.birthday = '';
        }

        setParticipants([...participants]); // Update state with new participant values
        formik.setFieldValue('participants', [...participants]); // Update Formik state
    };

    return (
        <Box className="container mt-4"> {/* Added Bootstrap container class */}
            <Typography variant="h5" sx={{ my: 2 }}>
                Participate in {eventTitle || 'Event'}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                {participants.map((participant, index) => (
                    <Box key={index} className="border rounded p-3 mb-3"> {/* Bootstrap styling for each participant box */}
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Member {index + 1}
                        </Typography>
                        {index === 0 && (
                            <FormControlLabel
                                control={
                                    <Checkbox onChange={handleAutoFill} />
                                }
                                label="Autofill with my information"
                            />
                        )}
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
                                    label="Email"
                                    name={`participants[${index}].email`}
                                    value={participant.email}
                                    onChange={handleParticipantChange(index, 'email')}
                                    error={Boolean(formik.errors.participants?.[index]?.email)}
                                    helperText={formik.errors.participants?.[index]?.email}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name={`participants[${index}].gender`}
                                        value={participant.gender}
                                        onChange={handleParticipantChange(index, 'gender')}
                                        error={Boolean(formik.errors.participants?.[index]?.gender)}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                    {formik.errors.participants?.[index]?.gender && (
                                        <Typography color="error" variant="caption">{formik.errors.participants[index].gender}</Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    label="Birthday"
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
                                    value={eventTitle} // Display the event title
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
