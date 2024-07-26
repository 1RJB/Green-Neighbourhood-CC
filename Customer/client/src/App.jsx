import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import CustomerRewards from './pages/CustomerRewards';
import RedeemReward from './pages/RedeemReward';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import Points from './pages/PointsInfo';
import http from './http';
import CustomerContext from './contexts/CustomerContext';

function App() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/customer/auth').then((res) => {
        setCustomer(res.data.customer);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <CustomerContext.Provider value={{ customer, setCustomer }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                <img src="greenhood.jpg" alt="Green Neighbourhood" width='80'/> 
                </Link>
                <Link to="/rewards" ><Typography>Rewards</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {customer && (
                  <>
                    <Typography>{customer.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )
                }
                {!customer && (
                  <>
                    <Link to="/customer/register" ><Typography>Register</Typography></Link>
                    <Link to="/customer/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<CustomerRewards />} />
              <Route path={"/rewards"} element={<CustomerRewards />} />
              <Route path={"/reward/redeem"} element={<RedeemReward />} />
              <Route path={"/customer/register"} element={<CustomerRegister />} />
              <Route path={"/customer/login"} element={<CustomerLogin />} />
              <Route path={"/points-info"} element={<Points />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </CustomerContext.Provider>
  );
}

export default App;
