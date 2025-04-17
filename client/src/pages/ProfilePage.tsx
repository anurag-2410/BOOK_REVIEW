import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Card, Alert, Tab, Tabs } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile');
      return;
    }

    setName(user.name);
    setEmail(user.email);
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'danger' });
      return;
    }

    if (password && password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'danger' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const userData = {
        name,
        email,
        ...(password && { password }),
      };

      await userAPI.updateUserProfile(userData);

      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setPassword('');
      setConfirmPassword('');

      // If user changed their password, log them out for security
      if (password) {
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setMessage({
        text:
          err.response && err.response.data.message
            ? err.response.data.message
            : 'An error occurred. Please try again.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-md-center mt-4">
        <Col xs={12} md={8}>
          <h2 className="mb-4">User Profile</h2>

          <Tabs defaultActiveKey="profile" className="mb-4">
            <Tab eventKey="profile" title="Profile">
              <Card className="p-4">
                <div className="d-flex align-items-center mb-4">
                  {React.createElement(FaUser, { className: "me-2", size: 24 })}
                  <h3 className="mb-0">Update Profile</h3>
                </div>

                {message && <Alert variant={message.type}>{message.text}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-flex align-items-center mb-3 mt-4">
                    {React.createElement(FaLock, { className: "me-2", size: 20 })}
                    <h5 className="mb-0">Change Password (Optional)</h5>
                  </div>

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              </Card>
            </Tab>
            <Tab eventKey="activity" title="Recent Activity">
              <Card className="p-4">
                <h3 className="mb-4">Your Recent Activity</h3>
                <p className="text-muted">Feature coming soon...</p>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage; 