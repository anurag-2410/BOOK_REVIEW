import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { User, AuthContextType, AuthState } from '../types';
import { userAPI } from '../utils/api';

// Define action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Debug initial state
  useEffect(() => {
    console.log('Auth Provider initialized. User state:', state.user ? 'Logged in' : 'Not logged in');
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Login attempt for', email);
      dispatch({ type: 'LOGIN_REQUEST' });

      try {
        const userData = await userAPI.login(email, password);
        console.log('AuthContext: Login successful');
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } catch (error: any) {
        console.error('AuthContext: Login error details:', error);
        
        let errorMessage = 'Login failed. Please try again.';
        if (error.response) {
          errorMessage = error.response.data.message || 
                        'Server error. Please try again.';
        } else if (error.request) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        }
        
        dispatch({
          type: 'LOGIN_FAIL',
          payload: errorMessage,
        });
      }
    } catch (error: any) {
      console.error('AuthContext: Unexpected login error:', error);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('AuthContext: Registration attempt for', email);
      dispatch({ type: 'REGISTER_REQUEST' });

      try {
        const userData = await userAPI.register(name, email, password);
        console.log('AuthContext: Registration successful');
        dispatch({ type: 'REGISTER_SUCCESS', payload: userData });
      } catch (error: any) {
        console.error('AuthContext: Registration error details:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        if (error.response) {
          errorMessage = error.response.data.message || 
                        'Server error. Please try again.';
        } else if (error.request) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        }
        
        dispatch({
          type: 'REGISTER_FAIL',
          payload: errorMessage,
        });
      }
    } catch (error: any) {
      console.error('AuthContext: Unexpected registration error:', error);
      dispatch({
        type: 'REGISTER_FAIL',
        payload: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  // Logout user
  const logout = () => {
    console.log('AuthContext: Logging out user');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    console.log('AuthContext: Clearing error state');
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 