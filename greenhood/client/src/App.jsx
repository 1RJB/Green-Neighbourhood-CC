// App.jsx
import Register from './pages/Register';
import Login from './pages/Login';
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./header";


function App() {
  return (
    <Router>
      <Header />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
