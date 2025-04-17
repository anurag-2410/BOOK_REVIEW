import mongoose, { Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  genre: string[];
  coverImage: string;
  isbn: string;
  publicationDate: Date;
  publisher: string;
  pageCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book; 