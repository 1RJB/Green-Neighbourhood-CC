import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import logo from './assets/logo.png';
import './header.css';
import UserContext from './contexts/UserContext';

const Header = () => {
  const { user, userType, setUser, setUserType } = useContext(UserContext);

  useEffect(() => {
    console.log('User:', user);
    console.log('UserType:', userType);
  }, [user, userType]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setUserType(null);
    window.location = "/";
  };

  const renderUserLinks = () => {
    if (user) {
      if (userType === 'admin') {
        return (
          <>
            <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
          </>
        );
      }

      if (userType === 'staff') {
        return (
          <>
            <Nav.Link as={Link} to="/staff/tasks">Tasks</Nav.Link>
            <Nav.Link as={Link} to="/staff/reports">Reports</Nav.Link>
          </>
        );
      }

      return (
        <>
          <Nav.Link as={Link} to="/user/profile">Profile</Nav.Link>
          <Nav.Link as={Link} to="/user/settings">Settings</Nav.Link>
        </>
      );
    }

    return <Nav.Link as={Link} to="/login">Login</Nav.Link>;
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
            {renderUserLinks()}
          </Nav>
          {user && (
            <Dropdown alignRight>
              <Dropdown.Toggle as="a" className="user-dropdown-toggle">
                {user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
