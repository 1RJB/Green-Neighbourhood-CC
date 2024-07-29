// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./header";
import Register from './pages/Register';
import Login from './pages/Login';
import StaffRegister from './pages/staffRegister';
import AdminRegister from "./pages/adminRegister";
import ContactUs from "./pages/contactUs";
import UserProfile from "./pages/userprofile"; // Ensure the correct casing of the import
import UserContext from './contexts/UserContext';
import http from './http';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/userauth').then((res) => {
        setUser(res.data.user);
        setUserType(res.data.user.usertype);
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
