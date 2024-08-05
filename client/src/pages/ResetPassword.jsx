import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  console.log('Email:', email); // Debugging
  console.log('OTP:', otp); // Debugging

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      newPassword: yup
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
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.put("http://localhost:3000/user/resetPasswordByEmail", {
          email: email,
          otp: otp,
          newPassword: values.newPassword.trim(),
        });
        console.log("Password reset successful:", response.data);
        toast.success('Password reset successfully!');
        navigate("/login");
      } catch (error) {
        toast.error(`${error.response.data.message}`);
      }
    },
  });

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
        Reset Password
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
          label="New Password"
          name="newPassword"
          type="password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
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
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Reset Password
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default ResetPassword;
