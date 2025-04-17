import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Carousel, Card } from 'react-bootstrap';
import { Book } from '../types';
import { bookAPI } from '../utils/api';
import BookCard from '../components/BookCard';

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        const data = await bookAPI.getFeaturedBooks();
        setFeaturedBooks(data);
      } catch (err: any) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'An error occurred. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section py-5 mb-5 bg-light rounded">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <h1 className="display-4 fw-bold">Welcome to Book Review</h1>
              <p className="lead">
                Discover new books, share your thoughts, and connect with fellow readers.
              </p>
              <Link to="/books">
                <Button size="lg" variant="primary" className="mt-3">
                  Browse Books
                </Button>
              </Link>
            </Col>
            <Col md={6} className="d-flex justify-content-center mt-4 mt-md-0">
              <img
                src="https://images-cdn.reedsy.com/discovery/image/2249/image/large_d2a2bcb0125b0bb2b8413ce4cb76cfcfc7bca8d2.jpg"
                alt="Book Review Platform"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Books Section */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Featured Books</h2>
        {loading ? (
          <p className="text-center">Loading featured books...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : featuredBooks.length === 0 ? (
          <p className="text-center">No featured books available at the moment.</p>
        ) : (
          <>
            {/* Desktop View - Grid */}
            <div className="d-none d-md-block">
              <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {featuredBooks.map((book) => (
                  <Col key={book._id}>
                    <BookCard book={book} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Mobile View - Carousel */}
            <div className="d-block d-md-none">
              <Carousel indicators={false} className="book-carousel">
                {featuredBooks.map((book) => (
                  <Carousel.Item key={book._id} className="px-3 py-2">
                    <div className="carousel-card-container">
                      <BookCard book={book} />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </>
        )}
        <div className="text-center mt-4">
          <Link to="/books">
            <Button variant="outline-primary">
              View All Books
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-5 p-4 bg-light rounded">
        <h2 className="text-center mb-4">Why Book Review?</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="h-100 border-0 bg-transparent">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3 display-5 text-primary">📚</div>
                <Card.Title>Discover Great Books</Card.Title>
                <Card.Text>
                  Find your next favorite read with our curated collection of books across all genres.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 border-0 bg-transparent">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3 display-5 text-primary">✍️</div>
                <Card.Title>Share Your Thoughts</Card.Title>
                <Card.Text>
                  Write reviews, rate books, and help other readers discover great literature.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 border-0 bg-transparent">
              <Card.Body className="text-center">
                <div className="feature-icon mb-3 display-5 text-primary">👥</div>
                <Card.Title>Join the Community</Card.Title>
                <Card.Text>
                  Connect with other book lovers and expand your reading horizons.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default HomePage; 