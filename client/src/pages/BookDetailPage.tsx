import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Image,
  Badge,
  ListGroup,
  Card,
  Button,
} from 'react-bootstrap';
import { Book, Review } from '../types';
import { bookAPI, reviewAPI } from '../utils/api';
import Rating from '../components/Rating';
import ReviewItem from '../components/ReviewItem';
import ReviewForm from '../components/ReviewForm';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const bookData = await bookAPI.getBookById(id);
        setBook(bookData);
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

    fetchBookData();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        if (!id) return;
        
        const reviewsData = await reviewAPI.getReviewsForBook(id);
        setReviews(reviewsData);
      } catch (err: any) {
        setReviewsError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to load reviews.'
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewAdded = async () => {
    if (!id) return;
    
    try {
      const reviewsData = await reviewAPI.getReviewsForBook(id);
      setReviews(reviewsData);
    } catch (err: any) {
      setReviewsError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to refresh reviews.'
      );
    }
  };

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Container>
        <p className="text-center py-5">Loading book details...</p>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container>
        <div className="text-center py-5">
          <h2>Error</h2>
          <p className="text-danger">{error || 'Book not found'}</p>
          <Link to="/books">
            <Button variant="primary">Go Back to Books</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Link to="/books" className="btn btn-light my-3">
        Go Back
      </Link>
      
      <Row>
        <Col md={4} className="mb-4">
          <Image
            src={book.coverImage}
            alt={book.title}
            fluid
            className="book-detail-image"
          />
        </Col>
        
        <Col md={5} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title as="h2">{book.title}</Card.Title>
              <Card.Text as="h5" className="text-muted mb-3">
                By {book.author}
              </Card.Text>
              
              <div className="mb-3 d-flex align-items-center">
                <Rating value={averageRating} text={`${reviews.length} reviews`} />
              </div>
              
              <Card.Text className="mb-3">
                {book.genre.map((g, index) => (
                  <Badge bg="secondary" className="me-1" key={index}>
                    {g}
                  </Badge>
                ))}
              </Card.Text>
              
              <Card.Text>{book.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Publisher:</Col>
                  <Col>{book.publisher}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>Published:</Col>
                  <Col>{new Date(book.publicationDate).toLocaleDateString()}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>ISBN:</Col>
                  <Col>{book.isbn}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>Pages:</Col>
                  <Col>{book.pageCount}</Col>
                </Row>
              </ListGroup.Item>
              
              {book.featured && (
                <ListGroup.Item>
                  <Badge bg="success" className="w-100 py-2">
                    Featured Book
                  </Badge>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <h3 className="mb-3">Reviews</h3>
          
          <ReviewForm bookId={book._id} onSuccess={handleReviewAdded} />
          
          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviewsError ? (
            <p className="text-danger">{reviewsError}</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this book!</p>
          ) : (
            reviews.map((review) => <ReviewItem key={review._id} review={review} />)
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetailPage; 