import express from 'express';
import { body } from 'express-validator';
import {
  getBooks,
  getBookById,
  createBook,
  getFeaturedBooks,
} from '../controllers/bookController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/books
// @desc    Fetch all books with pagination
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/featured
// @desc    Fetch featured books
// @access  Public
router.get('/featured', getFeaturedBooks);

// @route   GET /api/books/:id
// @desc    Fetch single book
// @access  Public
router.get('/:id', getBookById);

// @route   POST /api/books
// @desc    Create a book
// @access  Private/Admin
router.post(
  '/',
  [
    protect,
    admin,
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('genre')
      .isArray({ min: 1 })
      .withMessage('At least one genre must be specified'),
    body('coverImage').notEmpty().withMessage('Cover image URL is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('publicationDate')
      .isISO8601()
      .withMessage('Publication date must be a valid date'),
    body('publisher').notEmpty().withMessage('Publisher is required'),
    body('pageCount')
      .isInt({ min: 1 })
      .withMessage('Page count must be a positive integer'),
  ],
  createBook
);

export default router;