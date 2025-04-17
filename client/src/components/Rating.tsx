import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  value: number;
  text?: string;
  color?: string;
  onClick?: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  value,
  text,
  color = '#f8e825',
  onClick,
}) => {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={onClick ? () => onClick(star) : undefined}>
          {value >= star ? (
            <span className="d-inline-block">
              <FaStar style={{ color }} />
            </span>
          ) : value >= star - 0.5 ? (
            <span className="d-inline-block">
              <FaStarHalfAlt style={{ color }} />
            </span>
          ) : (
            <span className="d-inline-block">
              <FaRegStar style={{ color }} />
            </span>
          )}
        </span>
      ))}
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};

export default Rating; 