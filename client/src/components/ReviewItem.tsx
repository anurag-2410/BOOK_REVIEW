import React from 'react';
import { Card } from 'react-bootstrap';
import { Review } from '../types';
import Rating from './Rating';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString();

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <strong>{review.user.name}</strong>
            <Rating value={review.rating} />
          </div>
          <small className="text-muted">{date}</small>
        </div>
        <Card.Text>{review.comment}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReviewItem; 