import React, { useState, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import Rating from './Rating';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  
  useEffect(() => {
    // Generate a random but consistent rating based on book ID
    // This is a temporary solution until the backend supports ratings
    const generateRating = () => {
      // Use book._id to generate a consistent hash
      let hash = 0;
      for (let i = 0; i < book._id.length; i++) {
        hash = ((hash << 5) - hash) + book._id.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      
      // Generate rating between 3.0 and 5.0
      const baseRating = 3.0 + (Math.abs(hash) % 20) / 10;
      
      // Generate number of reviews between 5 and 50
      const reviews = 5 + (Math.abs(hash) % 46);
      
      setRating(parseFloat(baseRating.toFixed(1)));
      setReviewCount(reviews);
    };
    
    generateRating();
  }, [book._id]);

  return (
    <Card className="book-card h-100 shadow-sm">
      <div className="book-image-container">
        <Link to={`/books/${book._id}`}>
          <Card.Img 
            variant="top" 
            src={book.coverImage || 'https://via.placeholder.com/150x230?text=No+Cover'} 
            alt={book.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://via.placeholder.com/150x230?text=No+Cover';
            }}
          />
          {book.featured && (
            <Badge 
              bg="warning" 
              text="dark"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '6px 10px'
              }}
            >
              Featured
            </Badge>
          )}
        </Link>
      </div>
      <Card.Body className="d-flex flex-column">
        <Link 
          to={`/books/${book._id}`} 
          className="text-decoration-none" 
          style={{ color: 'inherit' }}
        >
          <Card.Title 
            className="text-truncate" 
            title={book.title}
          >
            {book.title}
          </Card.Title>
        </Link>
        
        <Card.Subtitle 
          className="mb-2 text-muted text-truncate" 
          title={book.author}
        >
          {book.author}
        </Card.Subtitle>
        
        <div className="mb-2">
          <Rating value={rating} text={`${rating}/5 (${reviewCount})`} />
        </div>
        
        <Card.Text 
          className="small text-muted mb-0 mt-auto d-flex justify-content-between"
        >
          <span>{book.genre[0]}</span>
          <span>{new Date(book.publicationDate).getFullYear()}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BookCard; 