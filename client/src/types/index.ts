// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token?: string;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string[];
  coverImage: string;
  isbn: string;
  publicationDate: string;
  publisher: string;
  pageCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  book: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  page: number;
  pages: number;
  total: number;
  data: T[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication context types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} 