import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState("");

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            console.log('Event Data:', res.data); // Debug log
            const eventData = res.data;
            const [eventDate, eventTime] = eventData.createdAt.split("T");
            const [endDate, endTime] = eventData.endDetails.split("T");
            setEvent({
                ...eventData,
                eventDate: eventDate,
                eventTime: eventTime.slice(0, 5),
                endDate: endDate,
                endTime: endTime.slice(0, 5)
            });
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching event:', error);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            eventDate: "",
            endDate: "",
            eventTime: "",
            endTime: "",
            category: ""
        },
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
            eventDate: yup.string().required('Event date is required'),
            endDate: yup.string().required('End date is required'),
            eventTime: yup.string().required('Event time is required'),
            endTime: yup.string().required('End time is required'),
            category: yup.string().required('Category is required')
        }),
        onSubmit: (data) => {
            console.log('Form data:', data);
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.createdAt = `${data.eventDate}T${data.eventTime}`;
            data.endDetails = `${data.endDate}T${data.endTime}`;
            if (imageFile) {
                data.imageFile = imageFile;
            }
            http.put(`/event/${id}`, data)
                .then((res) => {
                    console.log('Response:', res.data);
                    navigate("/events");
                })
                .catch((error) => {
                    console.error('Error updating event:', error);
                });
        }
    });

    useEffect(() => {
        if (event) {
            console.log('Setting formik values:', event); // Debug log
            formik.setValues({
                title: event.title,
                description: event.description,
                eventDate: event.eventDate,
                endDate: event.endDate,
                eventTime: event.eventTime,
                endTime: event.endTime,
                category: event.category
            });
        }
    }, [event, formik]);

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
                console.log('Deleted:', res.data);
                navigate("/events");
            })
            .catch((error) => {
                console.error('Error deleting event:', error);
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
                    console.log('File upload error:', error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event
            </Typography>
            {!loading && (
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
                            <TextField
                                fullWidth
                                margin="dense"
                                type="date"
                                label="End Date"
                                name="endDate"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helperText={formik.touched.endDate && formik.errors.endDate}
                                InputLabelProps={{ shrink: true }}
                            />
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
                                label="End Time"
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
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button variant="contained" component="label">
                                    Upload Image
                                    <input hidden accept="image/*" type="file" onChange={onFileChange} />
                                </Button>
                                {imageFile && (
                                    <Box sx={{ mt: 2 }}>
                                        <img alt="event"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                            style={{ maxWidth: '100%' }}
                                        />
                                    </Box>
                                )}
                            </Box>
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
                <DialogTitle>Delete Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteEvent}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditEvent;
