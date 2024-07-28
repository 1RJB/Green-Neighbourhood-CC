import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Typography, TextField, Button } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactUs = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const formik = useFormik({
    initialValues: {
      from_name: '',
      email: '',
      message: ''
    },
    validationSchema: yup.object({
      from_name: yup.string().trim()
        .max(50, 'Name must be at most 50 characters')
        .required('Name is required'),
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      message: yup.string().trim()
        .min(10, 'Message must be at least 10 characters')
        .required('Message is required')
    }),
    onSubmit: (values, { resetForm }) => {
      if (!recaptchaToken) {
        toast.error('Please complete the reCAPTCHA');
        return;
      }

      const templateParams = {
        from_name: values.from_name,
        to_name: 'Greenhood Support Team', // Replace with the actual recipient name
        message: values.message,
        reply_to: values.email,
        'g-recaptcha-response': recaptchaToken,
      };

      emailjs.send('service_atajjxp', 'template_3b0ufsn', templateParams, 'YNOWo8S4upqxTO_Tk')
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          toast.success('Message sent successfully!');
          resetForm();
          setRecaptchaToken(null); // Reset reCAPTCHA token
        }, (error) => {
          console.log('FAILED...', error);
          toast.error('Failed to send message. Please try again later.');
        });
    }
  });

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Grid 1 - Span 12</Typography>
          </Box>
        </Col>
        <Col xs={6}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Grid 2 - Span 6</Typography>
          </Box>
        </Col>
        <Col xs={6}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Grid 3 - Span 6</Typography>
          </Box>
        </Col>
        <Col xs={12}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Grid 4 - Span 12</Typography>
          </Box>
        </Col>
        <Col xs={12}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Grid 5 - Span 12</Typography>
          </Box>
        </Col>
        <Col xs={12} md={8}>
          <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h5" sx={{ my: 2 }}>
              Contact Us
            </Typography>
            <Box component="form" sx={{ width: '100%' }}
              onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth margin="dense" autoComplete="off"
                label="Name"
                name="from_name"
                value={formik.values.from_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.from_name && Boolean(formik.errors.from_name)}
                helperText={formik.touched.from_name && formik.errors.from_name}
              />
              <TextField
                fullWidth margin="dense" autoComplete="off"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth margin="dense" autoComplete="off"
                label="Message"
                name="message" multiline rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
              />
              <ReCAPTCHA
                sitekey="6LdxyxkqAAAAAHkTZiQF6k35dPDBg6pv89g_nHwl"
                onChange={handleRecaptchaChange}
              />
              <Button fullWidth variant="contained" sx={{ mt: 2 }}
                type="submit">
                Submit
              </Button>
            </Box>
            <ToastContainer />
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
