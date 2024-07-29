import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Participants from './pages/Participants';
import AddParticipant from './pages/AddParticipant';
import EditParticipant from './pages/EditParticipant';
import Register from './pages/Register';
import Login from './pages/Login';
import Events from './pages/Events'; 
import http from './http';
import UserContext from './contexts/UserContext';
import ParticipateEvent from './pages/ParticipateEvent';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    GreenHood
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {!user && (
                  <>
                    <Link to="/" ><Typography>Events</Typography></Link>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
                {user && (
                  <>
                    <Link to="/participants" ><Typography>Event Participants</Typography></Link>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/" element={<Events />} />
              <Route path="/participants" element={<Participants />} />
              <Route path="/participateevent" element={<ParticipateEvent />} />
              <Route path="/addparticipant" element={<AddParticipant />} />
              <Route path="/editparticipant/:id" element={<EditParticipant />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;