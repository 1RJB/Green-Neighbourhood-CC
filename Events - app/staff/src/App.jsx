import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Register from './pages/Register';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import { useState, useEffect } from 'react';
import http from './http';
import StaffContext from './contexts/StaffContext';


function App() {
  const [staff, setStaff] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/staff/StaffAuth').then((res) => {
        setStaff(res.data.staff);
      });
      // Todo: get staff data from server
      setStaff({ name: 'Staff' });
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
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    GREENHOOD
                  </Typography>
                </Link>
                <Link to="/events" ><Typography>Staff Events Page</Typography></Link>
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
              <Route path={"/"} element={<Events />} />
              <Route path={"/events"} element={<Events />} />
              <Route path={"/addevent"} element={<AddEvent />} />
              <Route path={"/editevent/:id"} element={<EditEvent />} />
              {/* staff page */}
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />

            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </StaffContext.Provider>
  );
}
export default App;