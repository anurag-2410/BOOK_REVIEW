import mongoose, { Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId;
  book: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only review a book once
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review; 