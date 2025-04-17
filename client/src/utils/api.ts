import axios from 'axios';
import { Book, Review, User, PaginatedResponse } from '../types';

const API_URL = 'http://localhost:5001/api';

// Create an axios instance with improved settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false, // No need to send cookies
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    // Add timestamp to URL to prevent caching issues
    const timestamp = new Date().getTime();
    config.url = config.url + (config.url?.includes('?') ? '&' : '?') + `_t=${timestamp}`;
    
    // Attach auth token if available
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error Response:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received');
    }
    return Promise.reject(error);
  }
);

// Book APIs
export const bookAPI = {
  getBooks: async (page = 1, keyword = '', genre = ''): Promise<PaginatedResponse<Book>> => {
    try {
      const { data } = await api.get(
        `/books?pageNumber=${page}&keyword=${keyword}&genre=${genre}`
      );
      return {
        data: data.books,
        page: data.page,
        pages: data.pages,
        total: data.total,
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },
  
  getFeaturedBooks: async (): Promise<Book[]> => {
    try {
      console.log('Fetching featured books...');
      const { data } = await api.get('/books/featured');
      console.log('Featured books received:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching featured books:', error);
      throw error;
    }
  },
  
  getBookById: async (id: string): Promise<Book> => {
    try {
      const { data } = await api.get(`/books/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  },
  
  createBook: async (bookData: Omit<Book, '_id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    try {
      const { data } = await api.post('/books', bookData);
      return data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },
  
  getBookRating: async (bookId: string): Promise<{rating: number, count: number}> => {
    try {
      const { data } = await api.get(`/books/${bookId}/rating`);
      return data;
    } catch (error) {
      console.error(`Error fetching rating for book ${bookId}:`, error);
      // Return default rating if API fails
      return { rating: 0, count: 0 };
    }
  }
};

// Review APIs
export const reviewAPI = {
  getReviewsForBook: async (bookId: string): Promise<Review[]> => {
    try {
      const { data } = await api.get(`/reviews/${bookId}`);
      return data;
    } catch (error) {
      console.error(`Error fetching reviews for book ${bookId}:`, error);
      throw error;
    }
  },
  
  createReview: async (reviewData: {
    bookId: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    try {
      const { data } = await api.post('/reviews', reviewData);
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
};

// User APIs
export const userAPI = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      console.log(`Logging in user: ${email}`);
      const { data } = await api.post('/users/login', { email, password });
      console.log('Login successful');
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string): Promise<User> => {
    try {
      console.log(`Registering user: ${email}`);
      const { data } = await api.post('/users', { name, email, password });
      console.log('Registration successful');
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  getUserProfile: async (): Promise<User> => {
    try {
      const { data } = await api.get('/users/profile');
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  updateUserProfile: async (userData: {
    name?: string;
    email?: string;
    password?: string;
  }): Promise<User> => {
    try {
      const { data } = await api.put('/users/profile', userData);
      // Update localStorage with new user data but keep the existing token
      const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...data, token: existingUser.token };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
}; 