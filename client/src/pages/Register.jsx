Register.jsx
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import axios from "axios";
import http from "../http";
import emailjs from 'emailjs-com';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
  const templateParams = {
    to_email: email,
    otp: otp,
  };

  try {
    await emailjs.send('service_atajjxp', 'template_c8ziunu', templateParams, 'YNOWo8S4upqxTO_Tk');
    toast.success('OTP sent successfully!');
  } catch (error) {
    console.error('Failed to send OTP', error);
    toast.error('Failed to send OTP. Please try again later.');
  }
};

function Register() {
  const navigate = useNavigate();
  const [generatedOtp, setGeneratedOtp] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthday: "",
      gender: "",
      otp: ""
    },
    validationSchema: yup.object({
      firstName: yup
        .string()
        .trim()
        .min(3, "First Name must be at least 3 characters")
        .max(25, "First Name must be at most 25 characters")
        .required("First Name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "First Name only allows letters, spaces, and characters: ' - , ."
        ),
      lastName: yup
        .string()
        .trim()
        .min(3, "Last Name must be at least 3 characters")
        .max(25, "Last Name must be at most 25 characters")
        .required("Last Name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Last Name only allows letters, spaces, and characters: ' - , ."
        ),
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      gender: yup
        .string()
        .oneOf(["Male", "Female"], "Gender must be either Male or Female")
        .required("Gender is required"),
      birthday: yup
        .date()
        .max(new Date(), "Birthday cannot be in the future")
        .required("Birthday is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "Password must contain at least 1 letter and 1 number"
        ),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      otp: yup
        .string()
        .required('OTP is required')
        .test('otp-match', 'Invalid OTP', value => value === generatedOtp),
    }),
    onSubmit: async (values) => {
      try {
        const response = await http.post("/user/register", {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password.trim(),
          confirmPassword: values.confirmPassword.trim(),
          birthday: values.birthday,
          gender: values.gender,
        });
        console.log("Registration successful:", response.data);
        navigate("/login");
      } catch (error) {
        toast.error(`${error.response.data.message}`);
      }
    },
  });

  const handleSendOtp = async () => {
    const otp = generateOTP();
    setGeneratedOtp(otp);
    await sendOTP(formik.values.email, otp);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Register
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="First Name"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Last Name"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, marginBottom: 2 }}
          onClick={handleSendOtp}
        >
          Send OTP
        </Button>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="OTP"
          name="otp"
          value={formik.values.otp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.otp && Boolean(formik.errors.otp)}
          helperText={formik.touched.otp && formik.errors.otp}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Birthday"
          name="birthday"
          type="date"
          value={formik.values.birthday}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: new Date().toISOString().split("T")[0],
          }}
          error={formik.touched.birthday && Boolean(formik.errors.birthday)}
          helperText={formik.touched.birthday && formik.errors.birthday}
        />
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
          {formik.touched.gender && formik.errors.gender && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formik.errors.gender}
            </Typography>
          )}
        </FormControl>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Register
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Register;
