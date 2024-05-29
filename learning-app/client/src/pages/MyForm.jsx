import React from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
// npm install @mui/x-date-pickers
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function MyForm() {
    const formik = useFormik({
        initialValues: {
            title: 'My title',
            description: 'My description',
            price: 0,
            option: '',
            date: dayjs().add(1, 'day'),
            time: dayjs().minute(0),
            datetime: dayjs().add(1, 'day').minute(0),
            tnc: false
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
            price: yup.number().min(0).required('Price is required'),
            option: yup.string().required('Option is required'),
            date: yup.date().typeError('Invalid date').required('Date is required'),
            time: yup.date().typeError('Invalid time').required('Time is required'),
            datetime: yup.date().typeError('Invalid date time').required('Date Time is required'),
            tnc: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required')
        }),
        onSubmit: (data) => {
            // create a new object for submission
            let dataToSubmit = { ...data };
            dataToSubmit.title = data.title.trim();
            dataToSubmit.description = data.description.trim();
            dataToSubmit.date = data.date.format('YYYY-MM-DD');
            dataToSubmit.time = data.time.format('HH:mm');
            console.log(dataToSubmit);
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                My Example Form
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            type="number"
                            inputProps={{
                                min: 0,
                                step: 0.1,
                            }}
                            label="Price"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense"
                            error={formik.touched.option && Boolean(formik.errors.option)}>
                            <InputLabel>Option</InputLabel>
                            <Select label="Option"
                                name="option"
                                value={formik.values.option}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value={'A'}>Option A</MenuItem>
                                <MenuItem value={'B'}>Option B</MenuItem>
                                <MenuItem value={'C'}>Option C</MenuItem>
                                <MenuItem value={'D'}>Option D</MenuItem>
                            </Select>
                            <FormHelperText>{formik.touched.option && formik.errors.option}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker format="DD/MM/YYYY"
                                    label="Select Date"
                                    name="date"
                                    value={formik.values.date}
                                    onChange={(date) => formik.setFieldValue('date', date)}
                                    onBlur={() => formik.setFieldTouched('date', true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.date && Boolean(formik.errors.date),
                                            helperText: formik.touched.date && formik.errors.date
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Select Time"
                                    name="time"
                                    value={formik.values.time}
                                    onChange={(time) => formik.setFieldValue('time', time)}
                                    onBlur={() => formik.setFieldTouched('time', true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.time && Boolean(formik.errors.time),
                                            helperText: formik.touched.time && formik.errors.time
                                        }
                                    }} />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker format="DD/MM/YYYY hh:mm A"
                                    label="Select Date Time"
                                    name="datetime"
                                    value={formik.values.datetime}
                                    onChange={(datetime) => formik.setFieldValue('datetime', datetime)}
                                    onBlur={() => formik.setFieldTouched('datetime', true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.datetime && Boolean(formik.errors.datetime),
                                            helperText: formik.touched.datetime && formik.errors.datetime
                                        }
                                    }} />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense"
                            error={formik.touched.tnc && Boolean(formik.errors.tnc)}>
                            <FormControlLabel control={
                                <Checkbox name="tnc"
                                    checked={formik.values.tnc}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            } label="I Accept Terms & Conditions" />
                            <FormHelperText>{formik.touched.tnc && formik.errors.tnc}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default MyForm;