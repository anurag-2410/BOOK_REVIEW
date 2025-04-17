# Book Review Platform

A full-stack web application for browsing books, reading and writing reviews, and rating books. Built with React, Node.js, Express, and MongoDB.

## Features

- User authentication and profile management
- Browse and search books by title, author, and genre
- View book details and reviews
- Submit ratings and reviews for books
- Responsive design for all devices

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- React Bootstrap for UI components
- React Icons
- Axios for API requests
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB instance (local or cloud)

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in your MongoDB URI and JWT secret.

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID (Admin only)

### Books
- `GET /api/books` - Get all books (with pagination, search, and filters)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/:id` - Get a single book
- `POST /api/books` - Create a new book (Admin only)

### Reviews
- `GET /api/reviews/:bookId` - Get reviews for a book
- `POST /api/reviews` - Create a new review

## License
MIT 