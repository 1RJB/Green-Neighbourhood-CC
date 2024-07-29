import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import CustomerRewards from './pages/CustomerRewards';
import RedeemReward from './pages/RedeemReward';
import CustomerRegister from './pages/CustomerRegister';
import CustomerLogin from './pages/CustomerLogin';
import Points from './pages/PointsInfo';
import CustomerContext, { CustomerProvider } from './contexts/CustomerContext';
import { ToastContainer } from 'react-toastify';

function App() {
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <CustomerProvider>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <img src="greenhood.jpg" alt="Green Neighbourhood" width='80' />
                </Link>
                <Link to="/rewards"><Typography>Rewards</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                <CustomerContext.Consumer>
                  {({ customer }) => (
                    <>
                      {customer ? (
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
                    </>
                  )}
                </CustomerContext.Consumer>
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<CustomerRewards />} />
              <Route path={"/rewards"} element={<CustomerRewards />} />
              <Route path={"/reward/redeem/:id"} element={<RedeemReward />} />
              <Route path={"/customer/register"} element={<CustomerRegister />} />
              <Route path={"/customer/login"} element={<CustomerLogin />} />
              <Route path={"/points-info"} element={<Points />} />
            </Routes>
          </Container>
          <ToastContainer />
        </ThemeProvider>
      </Router>
    </CustomerProvider>
  );
}

export default App;
