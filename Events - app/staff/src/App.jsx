import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./header";
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import StaffRegister from './pages/staffRegister';
import AdminRegister from "./pages/adminRegister";
import ContactUs from "./pages/contactUs";
import UserProfile from "./pages/userprofile";
import { useState, useEffect } from 'react';
import UserContext from './contexts/UserContext';
import http from './http';


function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/userauth').then((res) => {
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
            <Route path="/" element={<div>Home</div>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staffregister" element={<StaffRegister />} />
            <Route path={"/events"} element={<Events />} />
            <Route path={"/addevent"} element={<AddEvent />} />
            <Route path={"/editevent/:id"} element={<EditEvent />} />
            <Route path="/adminregister" element={<AdminRegister />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/userprofile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="*" element={<div>404 Not Found</div>} />

          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
