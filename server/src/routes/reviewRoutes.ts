import express from 'express';
import { body } from 'express-validator';
import { getReviewsForBook, createReview } from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/reviews/:bookId
// @desc    Get reviews for a book
// @access  Public
router.get('/:bookId', getReviewsForBook);

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post(
  '/',
  [
    protect,
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  createReview
);

export default router;