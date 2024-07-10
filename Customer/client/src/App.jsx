import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import UserRewards from './pages/UserRewards';
import RedeemReward from './pages/RedeemReward';
import Register from './pages/Register';
import UserLogin from './pages/UserLogin';
import http from './http';
import StaffContext from './contexts/StaffContext';

function App() {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/staff/auth').then((res) => {
        setStaff(res.data.staff);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <StaffContext.Provider value={{ staff, setStaff }}>
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
                {staff && (
                  <>
                    <Typography>{staff.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )
                }
                {!staff && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<UserRewards />} />
              <Route path={"/rewards"} element={<UserRewards />} />
              <Route path={"/reward/redeem"} element={<RedeemReward />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/user/login"} element={<UserLogin />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </StaffContext.Provider>
  );
}

export default App;
