import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    dayjs.extend(isSameOrAfter); 
    const [event, setEvent] = useState({
        title: "",
        description: "",
        eventDate: "",
        endDate: "",
        eventTime: "",
        endTime: "",
        category: ""  // Initialize category field
    });
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState("");

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            const eventData = res.data;
            const [eventDate, eventTime] = eventData.createdAt.split("T"); // Adjust splitting as per the actual format
            setEvent({ ...eventData, eventDate: eventDate, eventTime: eventTime.slice(0, 5) }); // Assuming eventTime is in "HH:MM:SS" format
            setImageFile(eventData.imageFile);
            setLoading(false);
        });
    }, [id]);
    const today = new Date().toISOString().split('T')[0];
    const formik = useFormik({
        initialValues: event,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            eventDate: yup.date()
                .min(today, 'Event date cannot be in the past')
                .required('Event date is required'),
            endDate: yup.date()
                .min(today, 'Event End date cannot be in the past')
                .required('Event End date is required')
                .test('is-after-event-date', 'End date must be after event date', function (value) {
                    const { eventDate } = this.parent;
                    return dayjs(value).isSameOrAfter(dayjs(eventDate), 'day');
                }),
            eventTime: yup.string().required('Event time is required'),
            endTime: yup.string().required('Event End time is required'),
            category: yup.string().required('Category is required')  // Add validation for category
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.createdAt = `${data.eventDate}T${data.eventTime}`; // Adjust format as needed
            if (imageFile) {
                data.imageFile = imageFile;
            }
            http.put(`/event/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
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

    const deleteEvent = () => {
        http.delete(`/event/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/events");
            });
    };

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                // Assuming you have a toast mechanism in place
                // toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    multiline
                                    minRows={2}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            type="date"
                                            label="Event Date"
                                            name="eventDate"
                                            value={formik.values.eventDate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                                            helperText={formik.touched.eventDate && formik.errors.eventDate}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            type="date"
                                            label="Event End Date"
                                            name="endDate"  // <-- This should be "endDate"
                                            value={formik.values.endDate}  // <-- Bind this to formik.values.endDate
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                            helperText={formik.touched.endDate && formik.errors.endDate}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    type="time"
                                    label="Event Time"
                                    name="eventTime"
                                    value={formik.values.eventTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eventTime && Boolean(formik.errors.eventTime)}
                                    helperText={formik.touched.eventTime && formik.errors.eventTime}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    type="time"
                                    label="Event end Time"
                                    name="endTime"
                                    value={formik.values.endTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                                    helperText={formik.touched.endTime && formik.errors.endTime}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <FormControl fullWidth margin="dense" error={formik.touched.category && Boolean(formik.errors.category)}>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        name="category"
                                        value={formik.values.category}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        InputLabelProps={{ shrink: true }}
                                    >
                                        <MenuItem value="">Select a category</MenuItem>
                                        <MenuItem value="Sustainable">Sustainable</MenuItem>
                                        <MenuItem value="Sports">Sports</MenuItem>
                                        <MenuItem value="Community">Community</MenuItem>
                                        <MenuItem value="Workshop">Workshop</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                    {formik.touched.category && formik.errors.category && (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.category}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" type="file" onChange={onFileChange} />
                                    </Button>
                                    {imageFile && (
                                        <Box sx={{ mt: 2 }}>
                                            <img alt="event"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                                style={{ maxWidth: '100%' }}>
                                            </img>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteEvent}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditEvent;
