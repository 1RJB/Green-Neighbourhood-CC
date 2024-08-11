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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
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
        .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
        .required('OTP is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:3001/user/register", {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password.trim(),
          confirmPassword: values.confirmPassword.trim(),
          birthday: values.birthday,
          gender: values.gender,
          otp: values.otp
        });
        console.log("Registration successful:", response.data);
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      } catch (error) {
        toast.error(`${error.response.data.message}`);
      }
    },
  });

  const handleSendOtp = async () => {
    try {
      // Generate OTP on the server and store it in the database
      const response = await axios.post("http://localhost:3001/user/sendOtp", {
        email: formik.values.email,
      });

      const otp = response.data.otp; // Assuming the server returns the OTP for demonstration

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
