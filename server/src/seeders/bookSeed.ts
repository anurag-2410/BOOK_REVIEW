import mongoose from 'mongoose';
import Book from '../models/Book';
import connectDB from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description:
      'The story of the enigmatic Jay Gatsby and his love for the beautiful Daisy Buchanan, set against the backdrop of the Jazz Age in New York.',
    genre: ['Fiction', 'Classic'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,gatsby',
    isbn: '9780743273565',
    publicationDate: new Date('1925-04-10'),
    publisher: 'Scribner',
    pageCount: 180,
    featured: true,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description:
      'A story about racial inequality and moral growth, seen through the eyes of a young girl in Alabama during the Great Depression.',
    genre: ['Fiction', 'Classic', 'Historical'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,mockingbird',
    isbn: '9780061120084',
    publicationDate: new Date('1960-07-11'),
    publisher: 'HarperCollins',
    pageCount: 281,
    featured: true,
  },
  {
    title: '1984',
    author: 'George Orwell',
    description:
      'A dystopian social science fiction novel set in a totalitarian future where critical thought is suppressed under a totalitarian regime.',
    genre: ['Fiction', 'Dystopian', 'Science Fiction'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,1984',
    isbn: '9780451524935',
    publicationDate: new Date('1949-06-08'),
    publisher: 'Signet Classics',
    pageCount: 328,
    featured: true,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description:
      'A romantic novel following the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.',
    genre: ['Fiction', 'Classic', 'Romance'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,pride',
    isbn: '9780141439518',
    publicationDate: new Date('1813-01-28'),
    publisher: 'Penguin Classics',
    pageCount: 432,
    featured: true,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description:
      'The adventure of Bilbo Baggins, a hobbit who embarks on an unexpected journey to reclaim the Lonely Mountain from the dragon Smaug.',
    genre: ['Fiction', 'Fantasy', 'Adventure'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,hobbit',
    isbn: '9780547928227',
    publicationDate: new Date('1937-09-21'),
    publisher: 'Houghton Mifflin Harcourt',
    pageCount: 300,
    featured: true,
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description:
      'A classic novel originally published for adults, it has since become popular with adolescent readers for its themes of teenage angst and alienation.',
    genre: ['Fiction', 'Classic', 'Coming-of-age'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,catcher',
    isbn: '9780316769488',
    publicationDate: new Date('1951-07-16'),
    publisher: 'Little, Brown and Company',
    pageCount: 277,
    featured: true,
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    description:
      'An epic high-fantasy novel that follows hobbits Frodo and Sam as they journey to destroy the One Ring, which was created by the Dark Lord Sauron.',
    genre: ['Fiction', 'Fantasy', 'Epic'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,lordoftherings',
    isbn: '9780618640157',
    publicationDate: new Date('1954-07-29'),
    publisher: 'Houghton Mifflin Harcourt',
    pageCount: 1178,
    featured: false,
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description:
      'The first novel in the Harry Potter series, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.',
    genre: ['Fiction', 'Fantasy', 'Young Adult'],
    coverImage: 'https://source.unsplash.com/random/400x600?book,harrypotter',
    isbn: '9780747532699',
    publicationDate: new Date('1997-06-26'),
    publisher: 'Bloomsbury',
    pageCount: 223,
    featured: false,
  }
];

const seedBooks = async () => {
  try {
    await connectDB();
    
    // Delete existing books
    await Book.deleteMany({});
    console.log('Books cleared');
    
    // Insert sample books
    await Book.insertMany(sampleBooks);
    console.log('Sample books inserted!');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedBooks(); 