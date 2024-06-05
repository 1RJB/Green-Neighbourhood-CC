import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      // Todo: get user data from server
      setUser({ name: 'User' });
    }
  }, []);
  const logout = () => {
    localStorage.clear();
    window.location = "/";
    };
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  Green Neighbourhood CC
                </Typography>
              </Link>
              <Link to="/Events" ><Typography>Events</Typography></Link>
              <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <Typography>{user.name}</Typography>
                  <Button onClick={logout}>Logout</Button>
                </>
              )
              }
              {!user && (
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
            <Route path={"/Events"} element={<Events />} />
            <Route path={"/addEvent"} element={<AddEvent />} />
            <Route path={"/editEvent/:id"} element={<EditEvent />} />
            <Route path={"/form"} element={<MyForm />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
