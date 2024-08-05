import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import axios from "axios";
import emailjs from 'emailjs-com';
import {
  Box,
  Typography,
  TextField,
  Button
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

function ForgotPassword() {
  const navigate = useNavigate();
  const [generatedOtp, setGeneratedOtp] = useState('');

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: ""
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      otp: yup
        .string()
        .required('OTP is required')
        .test('otp-match', 'Invalid OTP', value => value === generatedOtp),
    }),
    onSubmit: async (values) => {
      if (values.otp !== generatedOtp) {
        toast.error('Invalid OTP');
        return;
      }
      navigate("/resetPassword", { state: { email: values.email, otp: values.otp } });
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
        Forgot Password
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
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Verify OTP
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default ForgotPassword;