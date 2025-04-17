import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaBook, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="d-flex align-items-center">
            <span className="d-inline-block">
              <FaBook className="me-2" />
            </span>
            <span>Book Review</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/books">
              Browse Books
            </Nav.Link>
            {user ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <span className="d-inline-block">
                      <FaUser className="me-1" />
                    </span>
                    <span>{user.name}</span>
                  </span>
                }
                id="username"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <span className="d-flex align-items-center">
                    <span className="d-inline-block">
                      <FaSignOutAlt className="me-1" />
                    </span>
                    <span>Logout</span>
                  </span>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                <span className="d-flex align-items-center">
                  <span className="d-inline-block">
                    <FaUser className="me-1" />
                  </span>
                  <span>Sign In</span>
                </span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 