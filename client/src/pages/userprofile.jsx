import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Avatar, Grid, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import http from '../http';

const UserProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [isFormEdited, setIsFormEdited] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openSaveDialog, setOpenSaveDialog] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility

    useEffect(() => {
        // Fetch user info from the /userInfo endpoint
        http.get('/user/userInfo', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }).then((res) => {
            setUser(res.data);
            setReferralLink(`${res.data.referral_code}`);
            formik.setValues({
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                gender: res.data.gender,
                birthday: res.data.birthday,
                pfp: res.data.pfp,
                password: '',
                confirmPassword: ''
            });
            setLoading(false);
        }).catch(error => {
            console.error("Failed to fetch user data:", error);
            setLoading(false);
            toast.error("Failed to load user data.");
        });
    }, [setUser]);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            birthday: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            gender: Yup.string().required('Required'),
            birthday: Yup.date().required('Required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: (values) => {
            if (values.password && values.password !== values.confirmPassword) {
                toast.error("Passwords do not match.");
                return;
            }

            const dataToSubmit = { ...values };
            if (!values.password) {
                delete dataToSubmit.password;
                delete dataToSubmit.confirmPassword;
            }

            http.put(`/user/userInfo/${user.id}`, dataToSubmit, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            }).then((res) => {
                setUser(res.data);
                setIsFormEdited(false);
                toast.success("Profile updated successfully.");
            }).catch(error => {
                console.error("Failed to update user data:", error);
                toast.error("Failed to update profile.");
                if (error.response && error.response.data) {
                    console.error("Error response data:", error.response.data);
                    if (error.response.data.errors) {
                        error.response.data.errors.forEach(err => {
                            console.error(err);
                        });
                    }
                }
            });

            setOpenSaveDialog(false);
        },
    });

    const handleFieldChange = (e) => {
        formik.handleChange(e);
        setIsFormEdited(true);
    };

    const handleDeleteAccount = () => {
        http.delete(`/user/userInfo/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }).then((res) => {
            toast.success("Account deleted successfully.");
            setUser(null);
        }).catch(error => {
            console.error("Failed to delete account:", error);
            toast.error("Failed to delete account.");
        });
        setOpenDeleteDialog(false);
    };

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleClickOpenSaveDialog = () => {
        setOpenSaveDialog(true);
    };

    const handleCloseSaveDialog = () => {
        setOpenSaveDialog(false);
    };

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => {
                toast.success("Referral link copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy referral link.");
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
            <ToastContainer />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5">Your Referral Link:   {referralLink}</Typography>
                        <Button variant="outlined" onClick={handleCopyReferralLink}>
                            Copy Referral Link
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar src={user.pfp} alt={user.firstName} sx={{ width: 250, height: 250 }} />
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" sx={{ my: 2 }}>
                            Edit Profile
                        </Typography>
                        <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={handleFieldChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                                sx={{ my: 1 }}
                                required
                            />
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={handleFieldChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                                sx={{ my: 1 }}
                                required
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={handleFieldChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                sx={{ my: 1 }}
                                required
                            />
                            <FormControl component="fieldset" sx={{ my: 1 }}>
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    aria-label="gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={handleFieldChange}
                                    onBlur={formik.handleBlur}
                                    row
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                </RadioGroup>
                                {formik.touched.gender && formik.errors.gender && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.gender}
                                    </Typography>
                                )}
                            </FormControl>
                            <TextField
                                label="Birthday"
                                name="birthday"
                                type="date"
                                value={formik.values.birthday}
                                onChange={handleFieldChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                                helperText={formik.touched.birthday && formik.errors.birthday}
                                sx={{ my: 1 }}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                value={formik.values.password}
                                onChange={handleFieldChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                sx={{ my: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                                value={formik.values.confirmPassword}
                                onChange={handleFieldChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                sx={{ my: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={toggleConfirmPasswordVisibility}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                color={isFormEdited ? "primary" : "secondary"}
                                sx={{ my: 2 }}
                                disabled={!isFormEdited}
                                onClick={handleClickOpenSaveDialog}
                            >
                                Save
                            </Button>
                        </form>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClickOpenDeleteDialog}
                            sx={{ my: 2 }}
                        >
                            Delete Account
                        </Button>
                        <Dialog
                            open={openDeleteDialog}
                            onClose={handleCloseDeleteDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete your account? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDeleteDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteAccount} color="error" autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={openSaveDialog}
                            onClose={handleCloseSaveDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Save Changes"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to save the changes to your profile?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseSaveDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={formik.handleSubmit} color="primary" autoFocus>
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default UserProfile;
