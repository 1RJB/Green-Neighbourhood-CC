import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Typography, TextField, Button } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import greenhoodImage from '../assets/greenhood.webp';

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
    onSubmit: async (values, { resetForm }) => {
      if (!recaptchaToken) {
        toast.error('Please complete the reCAPTCHA');
        return;
      }

      try {
        const verificationResponse = await axios.get('https://emailvalidation.abstractapi.com/v1/', {
          params: {
            api_key: '65d044f6de87409098723f0a50c4e123',  // Replace with your actual Abstract API key
            email: values.email
          }
        });
        
        const verificationData = verificationResponse.data;

        console.log('Verification Data:', verificationData); // Debug log

        if (!verificationData.is_valid_format.value) {
          toast.error('Invalid email format');
          return;
        }

        if (verificationData.is_disposable_email.value) {
          toast.error('Disposable email addresses are not allowed');
          return;
        }

        if (!verificationData.is_mx_found.value) {
          toast.error('Email domain has no MX records');
          return;
        }

        if (!verificationData.is_smtp_valid.value) {
          toast.error('Please enter a valid email.');
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

      } catch (error) {
        console.error('Email verification failed', error);
        toast.error('Email verification failed. Please try again later.');
      }
    }
  });

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
<Container>
      <Row className="justify-content-center">
        <Col xs={12}>
          <Box sx={{ marginBottom: 5 }} className="d-flex justify-content-center align-items-center">
            <Typography variant="h3">About Us</Typography>
          </Box>
        </Col>
        <Col xs={6}>
          <Box sx={{ marginBottom: 5 }} className="d-flex justify-content-center align-items-center">
            <img src={greenhoodImage} alt="Greenhood Community Center" style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Col>
        <Col xs={6}>  
          <Box sx={{ marginBottom: 5 }} className="d-flex justify-content-center align-items-center" style={{marginTop:30}}>
            <Typography variant="h6">GreenHood CC was established on 17 April 2024 as a statutory board to promote racial harmony and social cohesion in Singapore. Our mission is to build and bridge communities in achieving one people, one Singapore. PA offers a wide range of programmes to cater to Singaporeans from all walks of life - connecting people to people, and people and government. We do this through our network of over 2,000 grassroots organisations (GROs), over 100 Community Clubs, five Community Development Councils, National Community Leadership Institute and PAssion WaVe.</Typography>
          </Box>
        </Col>
        <Col xs={12}>
          <Box sx={{ marginBottom: 3 }} className="d-flex justify-content-center align-items-center">
            <Typography variant="h4">Our vision for the community</Typography>
          </Box>
        </Col>
        <Col xs={12}>
          <Box sx={{ marginBottom: 2 }} className="d-flex justify-content-center align-items-center">
            <Typography variant="h6">A Great Home and A Caring Community, where we <ul><li>Share our ValuesPursue our Passions</li><li>Fulfil our Hopes</li><li>Treasure our Memories</li></ul></Typography>
          </Box>
        </Col>
        <Col xs={12} md={8} style={{marginTop:-80}}>
          <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h4" sx={{ my: 2 }}>
              Write a message to us!
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
              <Button fullWidth variant="contained" sx={{ mt: 2 , marginBottom: 5}}
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
