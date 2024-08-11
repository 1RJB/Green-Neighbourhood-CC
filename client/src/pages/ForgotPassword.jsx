import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isCooldown && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (cooldownTime === 0) {
      setIsCooldown(false);
    }

    return () => clearInterval(timer);
  }, [isCooldown, cooldownTime]);

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
        .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
        .required('OTP is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:3001/user/verifyForgotOtp", {
          email: values.email,
          otp: values.otp
        });

        console.log("OTP verified successfully:", response.data);
        toast.success("OTP verified successfully! Proceeding to reset password.");
        navigate("/resetPassword", { state: { email: values.email, otp: values.otp } });
      } catch (error) {
        toast.error(`${error.response.data.message}`);
      }
    },
  });

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/sendForgotOtp", {
        email: formik.values.email,
      });

      const otp = response.data.otp;

      // Send OTP via email using EmailJS
      const templateParams = {
        to_email: formik.values.email,
        otp: otp,
      };

      await emailjs.send('service_atajjxp', 'template_c8ziunu', templateParams, 'YNOWo8S4upqxTO_Tk');
      toast.success("OTP sent successfully!");

      // Start cooldown
      setIsCooldown(true);
      setCooldownTime(60); // 1 minute cooldown
    } catch (error) {
      console.error("Failed to send OTP", error);
      toast.error("Failed to send OTP. Please try again later.");
    }
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
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={8}>
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
              inputProps={{
                maxLength: 6,
                pattern: "[0-9]{6}",
                title: "OTP should be exactly 6 digits",
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendOtp}
              disabled={isCooldown}
            >
              {isCooldown ? `Retry in ${cooldownTime}s` : "Send OTP"}
            </Button>
          </Grid>
        </Grid>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Verify OTP
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default ForgotPassword;
