import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import emailjs from 'emailjs-com';

function EditRedemption() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [redemption, setRedemption] = useState({});
    const [loading, setLoading] = useState(true);

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
    }, [id]);

    const formik = useFormik({
        initialValues: {
            rewardTitle: redemption.reward?.title || '',
            firstName: redemption.user?.firstName || '',
            lastName: redemption.user?.lastName || '',
            email: redemption.user?.email || '',
            collectBy: redemption.collectBy ? dayjs(redemption.collectBy).format('YYYY-MM-DDTHH:mm:ss') : '',
            status: redemption.status || '',
        },
        validationSchema: yup.object({
            collectBy: yup.date().nullable(),
            status: yup.string()
                .oneOf(['Pending', 'Collected', 'Expired'])
                .required('Status is required'),
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            const updatedData = {
                collectBy: values.collectBy ? dayjs(values.collectBy).toISOString() : null,
                status: values.status,
            };
            http.put(`/redemption/${id}`, updatedData)
                .then((res) => {
                    toast.success('Redemption updated successfully!');
                    if (res.data.achievementEarned) {
                        sendEmailNotification(res.data);
                        toast.success('Email sent to user successfully!');
                    }
                    setTimeout(() => {
                        navigate('/reward/redemptions');
                    }, 5000);
                })
                .catch((error) => {
                    console.error('Update error:', error.response.data);
                    toast.error('Failed to update redemption');
                });
        }
    });

    const sendEmailNotification = (data) => {
        let salutation = ""
        if (data.gender === 'Female') {
            salutation = 'Mrs.';
        } else {
            salutation = 'Mr.';
        }

        const templateParams = {
            userLastName: data.userlastName,
            user_email: data.useremail,
            achievementTitle: "First redemption collected",
            salutation,
        };

        emailjs.send(
            'service_ktmad4e',
            'template_5vf2vow',
            templateParams,
            'cjdyxWCfcHYahHas1'
        )
        .then((response) => {
            console.log('Email sent successfully!', response.status, response.text);
        })
        .catch((error) => {
            console.error('Failed to send email:', error);
        });
    };

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
                                label="Reward Title"
                                value={redemption.reward?.title || ''}
                                disabled
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="First Name"
                                name="firstName"
                                value={redemption.user?.firstName || ''}
                                disabled
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Last Name"
                                name="lastName"
                                value={redemption.user?.lastName || ''}
                                disabled
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Email"
                                name="email"
                                value={redemption.user?.email || ''}
                                disabled
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Redeemed At"
                                value={dayjs(redemption.redeemedAt).format('DD/MM/YYYY HH:mm:ss') || ''}
                                disabled
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Collect By"
                                name="collectBy"
                                type="datetime-local"
                                value={formik.values.collectBy}
                                onChange={(e) => {
                                    const date = e.target.value ? dayjs(e.target.value).format('YYYY-MM-DDTHH:mm:ss') : '';
                                    formik.setFieldValue('collectBy', date);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.collectBy && Boolean(formik.errors.collectBy)}
                                helperText={formik.touched.collectBy && formik.errors.collectBy}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Status"
                                name="status"
                                select
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                                helperText={formik.touched.status && formik.errors.status}
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Collected">Collected</MenuItem>
                                <MenuItem value="Expired">Expired</MenuItem>
                            </TextField>
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
