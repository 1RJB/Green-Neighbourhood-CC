import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { userTheme, staffTheme } from './themes/MyTheme';
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
import EventDetails from './pages/EventDetails';
import ViewEvent from './pages/ViewEvent';
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
import Achievements from './pages/Achievements';
import ManageUsers from "./pages/manageUsers";
import ManageStaff from "./pages/manageStaff";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FaqPage from './pages/faq';
import StaffVolunteer from './pages/StaffVolunteer';

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

  const theme = userType === 'staff' || userType === 'admin' ? staffTheme : userTheme;

  return (
    <UserContext.Provider value={{ user, userType, setUser, setUserType }}>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
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
              <Route path="/eventdetails/:id" element={<EventDetails />} />
              <Route path="/viewevent/:id" element={<ViewEvent />} />
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
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/allusers" element={userType === 'staff' || userType === 'admin' ? <ManageUsers /> : <Navigate to="/" />} />
              <Route path="/allstaffs" element={userType === 'admin' ? <ManageStaff /> : <Navigate to="/" />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/faqpage" element={<FaqPage />} />
              <Route path ="/staff/volunteers" element={<StaffVolunteer />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Container>
          <ToastContainer />
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;