import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEvent() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            eventDate: "",
            eventTime: "",
            category: "",  // Initialize category field
            imageFile: null  // Initialize imageFile field
        },
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
            eventTime: yup.string().required('Event time is required'),
            category: yup.string().required('Category is required'),  // Add validation for category
            imageFile: yup.mixed().required('Image is required')  // Add validation for imageFile
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.createdAt = `${data.eventDate} ${data.eventTime}`; // Combine date and time
            http.post("/event", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
                })
                .catch((error) => {
                    console.error('Error submitting form:', error); // Log any errors
                });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
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
                    formik.setFieldValue('imageFile', res.data.filename);  // Update formik value
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };
    const handleClear = () => {
        formik.resetForm();
        setImageFile(null);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            margin="dense"
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
                            placeholder="YYYY-MM-DD"
                            value={formik.values.eventDate}
                            InputLabelProps={{ shrink: true }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                            helperText={formik.touched.eventDate && formik.errors.eventDate}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            type="time"
                            label="Event Time"
                            name="eventTime"
                            value={formik.values.eventTime}
                            placeholder="HH:MM" // Add placeholder for time
                            InputLabelProps={{ shrink: true }} // Ensure the label stays above the input
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventTime && Boolean(formik.errors.eventTime)}
                            helperText={formik.touched.eventTime && formik.errors.eventTime}
                        />
                        <FormControl fullWidth margin="dense" error={formik.touched.category && Boolean(formik.errors.category)}>
                            <InputLabel id="category-label" sx={{ top: -6, left: 0 }}>
                                Category
                            </InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Category"
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
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="tutorial"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                                
                            }
                        </Box>
                        {formik.touched.imageFile && formik.errors.imageFile && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                                {formik.errors.imageFile}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                    <Button variant="contained" color="error" onClick={handleClear} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Clear
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default AddEvent;

// re add everythig on update 8 