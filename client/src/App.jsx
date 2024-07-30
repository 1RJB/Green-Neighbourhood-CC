import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import RedemptionsMade from './pages/RedemptionsMade';
import Register from './pages/Register';
import Login from './pages/Login';
import RedeemReward from './pages/RedeemReward';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import Points from './pages/PointsInfo';
import http from './http';
import StaffContext from './contexts/StaffContext';
import CustomerContext, { CustomerProvider } from './contexts/CustomerContext';
import { ToastContainer } from 'react-toastify';

function App() {
  const [staff, setStaff] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/staff/auth').then((res) => {
        setStaff(res.data.staff);
      }).catch(() => {
        http.get('/customer/auth').then((res) => {
          setCustomer(res.data.customer);
        });
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <StaffContext.Provider value={{ staff, setStaff }}>
      <CustomerProvider>
        <Router>
          <ThemeProvider theme={MyTheme}>
            <AppBar position="static" className="AppBar">
              <Container>
                <Toolbar disableGutters={true}>
                  <Link to="/">
                    <img src="greenhood.jpg" alt="Green Neighbourhood" width='80' />
                  </Link>
                  <Link to="/events" className='pages'><Typography>Events</Typography></Link>
                  <Link to="/volunteer" className='pages'><Typography>Volunteering</Typography></Link>
                  <Link to="/aboutus" className='pages'><Typography>About Us</Typography></Link>
                  <Box sx={{ flexGrow: 1 }}></Box>
                  {staff ? (
                    <>
                      <Typography>{staff.name}</Typography>
                      <Button onClick={logout}>Logout</Button>
                    </>
                  ) : customer ? (
                    <>
                      <Typography>{customer.name}</Typography>
                      <Button onClick={logout}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/customer/register"><Typography>Register</Typography></Link>
                      <Link to="/customer/login"><Typography>Login</Typography></Link>
                    </>
                  )}
                </Toolbar>
              </Container>
            </AppBar>

            <Container>
              <Routes>
                <Route path={"/"} element={<Rewards />} />
                <Route path={"/rewards"} element={<Rewards />} />
                <Route path={"/reward/redeem/:id"} element={<RedeemReward />} />
                <Route path={"/customer/register"} element={<CustomerRegister />} />
                <Route path={"/customer/login"} element={<CustomerLogin />} />
                <Route path={"/points-info"} element={<Points />} />
                <Route path={"/staff/register"} element={<Register />} />
                <Route path={"/staff/login"} element={<Login />} />
                <Route path={"/addreward"} element={<AddReward />} />
                <Route path={"/editreward/:id"} element={<EditReward />} />
                <Route path={"/reward/redemptionsmade"} element={<RedemptionsMade />} />
              </Routes>
            </Container>
            <ToastContainer />
          </ThemeProvider>
        </Router>
      </CustomerProvider>
    </StaffContext.Provider>
  );
}

export default App;
