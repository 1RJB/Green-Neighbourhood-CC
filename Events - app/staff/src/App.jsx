import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from "./header";
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Register from './pages/Register';
import StaffRegister from './pages/staffRegister';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';
import http from './http';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
        setUserType(res.data.user.usertype); // Ensure usertype is fetched correctly
      }).catch(error => {
        console.error("Failed to fetch user data:", error);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUserType(null);
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, userType, setUser, setUserType }}>
      <Router>
        <Header />
        <Container className="mt-4">
          <Routes>
            
            <Route path={"/events"} element={<Events />} />
            <Route path={"/addevent"} element={<AddEvent />} />
            <Route path={"/editevent/:id"} element={<EditEvent />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staffregister" element={<StaffRegister />} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
