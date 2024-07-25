// src/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import logo from './assets/logo.png';
import './header.css';
import UserContext from './contexts/UserContext';

const Header = () => {
  const { user, userType, setUser, setUserType } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setUserType(null);
    window.location = "/";
  };

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            height="60"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/staffregister">Staff Register</Nav.Link>
          </Nav>
          {user ? (
            <Nav>
              <Navbar.Text>
                Signed in as: <span>{user.name}</span>
              </Navbar.Text>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
