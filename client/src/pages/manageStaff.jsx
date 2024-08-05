import React, { useEffect, useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import http from '../http';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const { userType, user } = useContext(UserContext);

  useEffect(() => {
    if (userType === 'admin') {
      http.get('/user/allUsers', {
        headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
  }).then((res) => {
    const filteredStaff = res.data.filter(user => user.usertype === 'staff');
    setStaff(filteredStaff);
    setLoading(false);
  }).catch(error => {
    console.error("Failed to fetch staff:", error);
    toast.error("Failed to load staff.");
    setLoading(false);
  });
} else {
  setLoading(false);
    }
  }, [userType]);

const handleEdit = (user) => {
  setSelectedStaff(user);
  setOpen(true);
  formik.setValues({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender,
    birthday: user.birthday,
    pfp: user.pfp,
    password: '',
    confirmPassword: ''
  });
};

const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this staff? This action cannot be undone.")) {
    http.delete(`/user/userInfo / ${ id }`, {
      headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
}).then((res) => {
  setStaff(staff.filter(user => user.id !== id));
  toast.success("Staff deleted successfully.");
}).catch(error => {
  console.error("Failed to delete staff:", error);
  toast.error("Failed to delete staff.");
});
    }
  };

const formik = useFormik({
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    pfp: ''
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

    http.put(`/user/userInfo / ${ selectedStaff.id }`, dataToSubmit, {
      headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
}).then((res) => {
  setStaff(staff.map(user => user.id === selectedStaff.id ? res.data : user));
  setOpen(false);
  toast.success("Staff updated successfully.");
}).catch(error => {
  console.error("Failed to update staff:", error);
  toast.error("Failed to update staff.");
});
    },
  });

if (loading) {
  return <div>Loading...</div>;
}
if (!user || userType !== 'admin') {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h6">You do not have permission to view this page.</Typography>
    </Box>
  );
}

return (
  <div style={{ height: 600, width: '100%' }}>
    <ToastContainer />
    <DataGrid
      rows={staff}
      columns={[
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'firstName', headerName: 'First name', width: 150 },
        { field: 'lastName', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'gender', headerName: 'Gender', width: 120 },
        { field: 'birthday', headerName: 'Birthday', width: 150 },
        { field: 'usertype', headerName: 'User Type', width: 150 },
        {
          field: 'edit',
          headerName: 'Actions',
          width: 150,
          renderCell: (params) => (
            <strong>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginRight: 16 }}
                onClick={() => handleEdit(params.row)}
              >
                Edit
              </Button>
            </strong>
          ),
        },
        {
          field: 'delete',
          headerName: 'Actions',
          width: 150,
          renderCell: (params) => (
            <strong>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </Button>
            </strong>
          ),
        },
      ]}
      pageSize={10}
      rowsPerPageOptions={[10]}
      checkboxSelection
      disableSelectionOnClick
    />
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Edit Staff</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset" sx={{ my: 1 }}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
            helperText={formik.touched.birthday && formik.errors.birthday}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            fullWidth
            sx={{ mb: 2 }}
          />
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  </div>
);
};

export default ManageStaff;