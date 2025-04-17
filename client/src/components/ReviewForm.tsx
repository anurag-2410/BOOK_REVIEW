import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { reviewAPI } from '../utils/api';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  bookId: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSuccess }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      setError('Please enter a comment');
      return;
    }
    
    try {
      setLoading(true);
      await reviewAPI.createReview({
        bookId,
        rating,
        comment,
      });
      
      setRating(0);
      setComment('');
      setError(null);
      onSuccess();
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

  if (!user) {
    return <Alert variant="info">Please sign in to leave a review</Alert>;
  }

  return (
    <div className="review-form-container mb-4">
      <h4>Write a Review</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <div>
            <Rating value={rating} onClick={(value) => setRating(value)} />
          </div>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book"
          />
        </Form.Group>
        
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm; 