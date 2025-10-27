import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types/auth';
import type { ReactNode } from 'react';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
      try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: email,
      password
    });

    // Assuming your backend returns user info or token:
    const data = response.data?.user;

    console.log('Login successful:', data);
    setUser(data);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', response.data.access_token);


  } catch (error: any) {
    console.error('Registration error:', error);

    // Extract backend error message if available
    const message =
      error.response?.data?.message ||
      error.message ||
      'Login failed';

    throw new Error(message);
  }
  };


  const register = async (email: string, password: string, name: string): Promise<void> => {
  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      username: email,
      password,
      name
    });

    // Assuming your backend returns user info or token:
    const data = response.data?.user;

    console.log('Registration successful:', data);
    const newUser: User = {
      id: data.id || Date.now().toString(),
      username: data.email || email,
      role: 'USER',
      name: data.name || name
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', response.data.access_token);

  } catch (error: any) {
    console.error('Registration error:', error);

    // Extract backend error message if available
    const message =
      error.response?.data?.message ||
      error.message ||
      'Registration failed';

    throw new Error(message);
  }
  };
  
  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const assignAdmin = async (userId: string): Promise<void> => {
    // Simulate API call - in real app, this would call your backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In real app, this would update the user's role in the database
        console.log(`Assigning admin role to user ${userId}`);
        resolve();
      }, 1000);
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    assignAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
