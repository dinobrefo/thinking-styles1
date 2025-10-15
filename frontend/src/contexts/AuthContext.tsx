import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'parent' | 'counselor' | 'admin';
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  dateOfBirth?: string;
  phoneNumber?: string;
  school?: string;
  grade?: string;
  parentEmail?: string;
  linkedStudents?: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: User['role'];
  gender?: User['gender'];
  dateOfBirth?: string;
  phoneNumber?: string;
  school?: string;
  grade?: string;
  parentEmail?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: Checking auth on app start, token:', token);
      if (token) {
        try {
          console.log('AuthContext: Token found, fetching user profile...');
          const response = await axios.get('/auth/profile');
          console.log('AuthContext: Profile fetched:', response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error('AuthContext: Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      } else {
        console.log('AuthContext: No token found');
      }
      setLoading(false);
      console.log('AuthContext: Auth check complete');
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login request...');
      const response = await axios.post('/auth/login', { email, password });
      console.log('AuthContext: Login response:', response.data);
      const { user: userData, token: newToken } = response.data;
      
      console.log('AuthContext: Setting token and user...');
      // Set token first
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Then set user
      setUser(userData);
      
      console.log('AuthContext: Login complete. User:', userData);
      // Return success to indicate login completed
      return Promise.resolve();
    } catch (error: any) {
      console.error('AuthContext: Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { user: newUser, token: newToken } = response.data;
      
      // Set token first
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Then set user
      setUser(newUser);
      
      // Return success to indicate registration completed
      return Promise.resolve();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      setUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
