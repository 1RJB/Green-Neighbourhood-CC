import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import { ToastContainer } from 'react-toastify';
import Header from './header';
import http from './http';
import UserContext from './contexts/UserContext';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import StaffRegister from './pages/staffRegister';
import AdminRegister from './pages/adminRegister';
import ContactUs from './pages/contactUs';
import Participants from './pages/Participants';
import EditParticipant from './pages/EditParticipant';
import ParticipateEvent from './pages/ParticipateEvent';
import UserProfile from './pages/userprofile';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Volunteers from './pages/Volunteers';
import AddVolunteer from './pages/AddVolunteer';
import EditVolunteer from './pages/EditVolunteer';
import Rewards from './pages/Rewards';
import AddReward from './pages/AddReward';
import EditReward from './pages/EditReward';
import Redemptions from './pages/Redemptions';
import RedeemReward from './pages/RedeemReward';
import Points from './pages/PointsInfo';
import EditRedemption from './pages/EditRedemption';
import LeaderBoard from './pages/LeaderBoard';
import ManageUsers from "./pages/manageUsers";
import ManageStaff from "./pages/manageStaff"; // Import ManageStaff correctly
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/userauth').then((res) => {
        setUser(res.data.user);
        setUserType(res.data.user.usertype);
      }).catch(error => {
        console.error("Failed to fetch user data:", error);
      });
    }
  }, [setUser, setUserType]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUserType(null);
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, userType, setUser, setUserType }}>
    <Router>
      <Header/>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/Volunteers" element={<Volunteers />} />
            <Route path="/add-volunteer" element={<AddVolunteer />} />
            <Route path="/edit-volunteer/:id" element={<EditVolunteer />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staffregister" element={<StaffRegister />} />
            <Route path="/adminregister" element={<AdminRegister />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/participateevent" element={<ParticipateEvent />} />
            <Route path="/events" element={<Events />} />
            <Route path={"/addevent"} element={<AddEvent />} />
            <Route path={"/editevent/:id"} element={<EditEvent />} />
            <Route path="/editparticipant/:id" element={<EditParticipant />} />
            <Route path="/userprofile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/reward/redeem/:id" element={<RedeemReward />} />
            <Route path="/points-info" element={<Points />} />
            <Route path="/addreward" element={<AddReward />} />
            <Route path="/editreward/:id" element={<EditReward />} />
            <Route path="/reward/redemptions" element={<Redemptions />} />
            <Route path="/reward/editredemption/:id" element={<EditRedemption />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/allusers" element={userType === 'staff' || userType === 'admin' ? <ManageUsers /> : <Navigate to="/" />} />
            <Route path="/allstaffs" element={userType === 'admin' ? <ManageStaff /> : <Navigate to="/" />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Container>
        <ToastContainer />
    </Router>
    </UserContext.Provider>
  );
}

export default App;