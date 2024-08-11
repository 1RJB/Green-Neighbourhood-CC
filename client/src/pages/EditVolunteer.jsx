import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; // Ensure this is imported

function EditVolunteer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState({
    dateAvailable: "",
    serviceType: "",
    comments: "",
    timeAvailable: null,
    duration: "",
    uploadPhoto: "",
    contactInfo: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceTypes] = useState([
    'All',
    'Education',
    'Healthcare',
    'Environment',
    'Animal Welfare',
    'Community Service',
    'Other'
  ]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    http.get(`/volunteer/${id}`)
      .then((res) => {
        let [hours, minutes] = res.data.timeAvailable.split(':');
        res.data.timeAvailable = dayjs().set('hour', hours).set('minute', minutes);
        setTicket(res.data);
        setImageFile(res.data.uploadPhoto);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ticket data', error);
        toast.error('Error fetching ticket data');
      });
  }

  const formik = useFormik({
    initialValues: ticket,
    enableReinitialize: true,
    validationSchema: yup.object({
      dateAvailable: yup.date().required('Date Available is required'),
      serviceType: yup.string()
        .oneOf(serviceTypes, 'Invalid Service Type') // Ensure serviceType is one of the defined options
        .required('Service Type is required'),
      comments: yup.string().max(500, 'Comments must be at most 500 characters'),
      timeAvailable: yup.date().required('Time Available is required'),
      duration: yup.number().integer().min(0, 'Duration must be at least 0').nullable(),
      contactInfo: yup.string().max(100, 'Contact Info must be at most 100 characters').nullable(),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.uploadPhoto = imageFile;
      }
      data.serviceType = data.serviceType.trim();
      data.timeAvailable = data.timeAvailable ? dayjs(data.timeAvailable).format('HH:mm') : '';
      data.comments = data.comments.trim();
      data.duration = data.duration ? parseInt(data.duration) : null;
      data.contactInfo = data.contactInfo.trim();
      http.put(`/volunteer/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/Volunteers");
        })
        .catch((error) => {
          console.error('Error updating ticket data!', error);
          toast.error('Error updating ticket data');
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

  const deleteTicket = () => {
    http.delete(`/volunteer/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/Volunteers");
      })
      .catch((error) => {
        console.error('Error deleting ticket!', error);
        toast.error('Error deleting ticket');
      });
  };

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
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Ticket
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={8}>
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  type="date"
                  label="Date Available"
                  name="dateAvailable"
                  value={formik.values.dateAvailable}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dateAvailable && Boolean(formik.errors.dateAvailable)}
                  helperText={formik.touched.dateAvailable && formik.errors.dateAvailable}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="serviceType-label">Service Type</InputLabel>
                  <Select
                    labelId="serviceType-label"
                    name="serviceType"
                    value={formik.values.serviceType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
                  >
                    {serviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.serviceType && formik.errors.serviceType && (
                    <FormHelperText error>{formik.errors.serviceType}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  multiline minRows={2}
                  label="Comments"
                  name="comments"
                  value={formik.values.comments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.comments && Boolean(formik.errors.comments)}
                  helperText={formik.touched.comments && formik.errors.comments}
                />
                <FormControl fullWidth margin="dense">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Select Time"
                      name="timeAvailable"
                      value={formik.values.timeAvailable}
                      onChange={(time) => {
                        formik.setFieldValue('timeAvailable', time);
                      }}
                      onBlur={() => formik.setFieldTouched('timeAvailable', true)}
                      slotProps={{
                        textField: {
                          error: formik.touched.timeAvailable && Boolean(formik.errors.timeAvailable),
                          helperText: formik.touched.timeAvailable && formik.errors.timeAvailable
                        }
                      }} />
                  </LocalizationProvider>
                </FormControl>
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  label="Duration"
                  name="duration"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.duration && Boolean(formik.errors.duration)}
                  helperText={formik.touched.duration && formik.errors.duration}
                />
                <TextField
                  fullWidth margin="dense" autoComplete="off"
                  label="Contact Info"
                  name="contactInfo"
                  value={formik.values.contactInfo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.contactInfo && Boolean(formik.errors.contactInfo)}
                  helperText={formik.touched.contactInfo && formik.errors.contactInfo}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteTicket} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default EditVolunteer;
