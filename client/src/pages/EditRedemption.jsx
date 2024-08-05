import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditRedemption() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [redemption, setRedemption] = useState({});
    const [loading, setLoading] = useState(true);
    const [rewardList, setRewardList] = useState([]);

    useEffect(() => {
        // Fetch redemption data
        http.get(`/redemption/${id}`)
            .then((res) => {
                setRedemption(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching redemption:', error);
                setLoading(false);
            });

        // Fetch Reward titles from the database
        http.get('/redemption')
            .then((res) => {
                setRewardList(res.data);
            })
            .catch((error) => {
                console.error('Error fetching rewards:', error);
            });
    }, [id]);

    const formik = useFormik({
        initialValues: {
            firstName: redemption.firstName || '',
            lastName: redemption.lastName || '',
            email: redemption.email || '',
        },
        validationSchema: yup.object({
            firstName: yup.string().trim()
                .min(3, 'First name must be at least 3 characters')
                .max(100, 'First name must be at most 100 characters')
                .required('First name is required'),
            lastName: yup.string().trim()
                .min(3, 'Last name must be at least 3 characters')
                .max(100, 'Last name must be at most 100 characters')
                .required('Last name is required'),
            email: yup.string().trim()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            http.put(`/redemption/${id}`, values)
                .then((res) => {
                    console.log(res.data);
                    toast.success('Redemption updated successfully');
                    navigate('/redemptions');
                })
                .catch((error) => {
                    console.error('Update error:', error);
                    toast.error('Failed to update redemption');
                });
        }
    });

    return (
        <Box p={3}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Redemption
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
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
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                    </Box>
                </Box>
            )}
            <ToastContainer />
        </Box>
    );
}

export default EditRedemption;
