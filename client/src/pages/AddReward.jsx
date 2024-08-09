import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddReward() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            points: "",
            category: "",
            maxEachRedeem: 1,
            maxTotalRedeem: 100
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Reward title must be at least 3 characters')
                .max(100, 'Reward title must be at most 100 characters')
                .required('Reward title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            startDate: yup.date()
                .min(new Date(), 'Start date cannot be in the past or current date')
                .required('Start date is required'),
            endDate: yup.date()
                .min(yup.ref('startDate'), 'End date cannot be before start date')
                .required('End date is required'),
            points: yup.number()
                .min(1, 'Points must be at least 1')
                .required('Points are required'),
            category: yup.string().required('Category is required'),
            maxEachRedeem: yup.number()
                .min(1, 'Maximum redeemable per user must be at least 1'),
            maxTotalRedeem: yup.number()
                .min(1, 'Maximum total redeemable must be at least 1')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();

            http.post("/reward", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/rewards");
                    toast.success('Reward added successfully.');
                })
                .catch((error) => {
                    console.error('Error adding reward:', error);
                    toast.error('Failed to add reward.');
                });
        }
    });

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((res) => setImageFile(res.data.filename))
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    toast.error('Failed to upload image.');
                });
        }
    };
    const handleClear = () => {
        formik.resetForm();
        setImageFile(null);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>Add Reward</Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            fullWidth margin="dense"
                            multiline minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            fullWidth margin="dense"
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                            helperText={formik.touched.startDate && formik.errors.startDate}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth margin="dense"
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth margin="dense"
                            label="Points"
                            name="points"
                            type="number"
                            value={formik.values.points}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.points && Boolean(formik.errors.points)}
                            helperText={formik.touched.points && formik.errors.points}
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
                                <MenuItem value="Vouchers">Vouchers</MenuItem>
                                <MenuItem value="Gift_Cards">Gift Cards</MenuItem>
                                <MenuItem value="Health_And_Wellness">Health And Wellness</MenuItem>
                                <MenuItem value="Workshops">Workshops</MenuItem>
                                <MenuItem value="Career_Development">Career Development</MenuItem>
                                <MenuItem value="Recognition">Recognition</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </Select>
                            {formik.touched.category && formik.errors.category && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.category}
                                </Typography>
                            )}
                        </FormControl>
                        <TextField
                            fullWidth margin="dense"
                            label="Max Number of Times Each User Can Redeem Reward"
                            name="maxEachRedeem"
                            type="number"
                            value={formik.values.maxEachRedeem}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.maxEachRedeem && Boolean(formik.errors.maxEachRedeem)}
                            helperText={formik.touched.maxEachRedeem && formik.errors.maxEachRedeem}
                        />
                        <TextField
                            fullWidth margin="dense"
                            label="Max Total Number of Redemptions for this Reward"
                            name="maxTotalRedeem"
                            type="number"
                            value={formik.values.maxTotalRedeem}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.maxTotalRedeem && Boolean(formik.errors.maxTotalRedeem)}
                            helperText={formik.touched.maxTotalRedeem && formik.errors.maxTotalRedeem}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                            </Button>
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img
                                            alt="reward"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
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
    );
}

export default AddReward;
