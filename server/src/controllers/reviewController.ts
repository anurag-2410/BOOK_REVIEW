import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Review from '../models/Review';
import Book from '../models/Book';

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
export const getReviewsForBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.bookId;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }
    
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { bookId, rating, comment } = req.body;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }
    
    // Check if user already reviewed this book
    const alreadyReviewed = await Review.findOne({
      user: req.user?._id,
      book: bookId,
    });
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this book');
    }
    
    // Create review
    const review = await Review.create({
      user: req.user?._id,
      book: bookId,
      rating: Number(rating),
      comment,
    });
    
    if (review) {
      const populatedReview = await Review.findById(review._id).populate('user', 'name');
      res.status(201).json(populatedReview);
    } else {
      res.status(400);
      throw new Error('Invalid review data');
    }
  } catch (error: any) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
}; 