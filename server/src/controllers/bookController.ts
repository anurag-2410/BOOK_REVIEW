import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Book from '../models/Book';

// @desc    Fetch all books with pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // Search query
    const keyword = req.query.keyword
      ? {
          $text: {
            $search: req.query.keyword as string,
          },
        }
      : {};
    
    // Genre filter
    const genreFilter = req.query.genre
      ? { genre: { $in: [req.query.genre] } }
      : {};
    
    // Combine filters
    const filter = {
      ...keyword,
      ...genreFilter,
    };

    const count = await Book.countDocuments(filter);
    
    const books = await Book.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      books,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    console.error('Error in getBooks:', error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Fetch featured books
// @route   GET /api/books/featured
// @access  Public
export const getFeaturedBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Getting featured books...');
    
    // Direct hardcoded response for testing
    const hardcodedBooks = [
      {
        _id: '5f9f1b9b9c9d9c0b8c8b8b8b',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'The story of the enigmatic Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        genre: ['Fiction', 'Classic'],
        coverImage: 'https://source.unsplash.com/random/400x600?book,gatsby',
        isbn: '9780743273565',
        publicationDate: new Date('1925-04-10'),
        publisher: 'Scribner',
        pageCount: 180,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '5f9f1b9b9c9d9c0b8c8b8b8c',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A story about racial inequality and moral growth in Alabama during the Great Depression.',
        genre: ['Fiction', 'Classic', 'Historical'],
        coverImage: 'https://source.unsplash.com/random/400x600?book,mockingbird',
        isbn: '9780061120084',
        publicationDate: new Date('1960-07-11'),
        publisher: 'HarperCollins',
        pageCount: 281,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // First try the database query
    const count = await Book.countDocuments({ featured: true });
    console.log(`Found ${count} featured books in database`);
    
    if (count > 0) {
      const books = await Book.find({ featured: true }).limit(6);
      console.log('Books retrieved from database:', books.length);
      res.json(books);
    } else {
      // If no books found, return hardcoded books
      console.log('Returning hardcoded books');
      res.json(hardcodedBooks);
    }
  } catch (error: any) {
    console.error('Error in getFeaturedBooks:', error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
  } catch (error: any) {
    console.error('Error in getBookById:', error);
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const {
      title,
      author,
      description,
      genre,
      coverImage,
      isbn,
      publicationDate,
      publisher,
      pageCount,
      featured,
    } = req.body;

    // Check if book with ISBN already exists
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      res.status(400);
      throw new Error('Book with this ISBN already exists');
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      coverImage,
      isbn,
      publicationDate,
      publisher,
      pageCount,
      featured: featured || false,
    });

    if (book) {
      res.status(201).json(book);
    } else {
      res.status(400);
      throw new Error('Invalid book data');
    }
  } catch (error: any) {
    console.error('Error in createBook:', error);
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
}; 