import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book';
import User from '../models/User';

dotenv.config();

const checkDatabase = async () => {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/book_review';
    console.log('Connecting to MongoDB:', uri);
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Check collections
    if (mongoose.connection && mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      console.log('Collections:', collections.map(c => c.collectionName));
    } else {
      console.log('Cannot access database collections - connection is not established properly');
    }
    
    // Check for books
    const bookCount = await Book.countDocuments();
    console.log(`Found ${bookCount} books in database`);
    
    if (bookCount > 0) {
      const featuredCount = await Book.countDocuments({ featured: true });
      console.log(`- Found ${featuredCount} featured books`);
      
      const books = await Book.find().limit(3);
      console.log('- Sample books:', books.map(b => ({ title: b.title, author: b.author })));
    }
    
    // Check for users
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in database`);
    
    if (userCount > 0) {
      const users = await User.find().select('name email').limit(3);
      console.log('- Sample users:', users.map(u => ({ name: u.name, email: u.email })));
    }
    
    console.log('Database check completed');
    
    await mongoose.connection.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
};

checkDatabase(); 