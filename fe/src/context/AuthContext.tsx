import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types/auth';
import type { ReactNode } from 'react';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user')!);
  const [user, setUser] = useState<User | null>(storedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(storedUser !== null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  

  useEffect(() => {

    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
    }
  }, [user, token])



  const login = async (email: string, password: string): Promise<void> => {
      try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: email,
      password
    });

    const data = response.data?.user;
   let token = response.data.access_token;

    // Parse if it's a JSON string, otherwise use as-is
    if (typeof token === 'string') {
      try {
        token = JSON.parse(token);
      } catch {
        // Already a plain string, use as-is
      }
    }

    setUser(data);
    setIsAuthenticated(!!token);
    // localStorage.setItem('user', JSON.stringify(data));
    setToken(token);


  } catch (error: any) {
    console.error('Registration error:', error);
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

    let token = response.data.access_token;

    // Parse if it's a JSON string, otherwise use as-is
    if (typeof token === 'string') {
      try {
        token = JSON.parse(token);
      } catch {
        // Already a plain string, use as-is
      }
    }
    const newUser: User = {
      id: data.id || Date.now().toString(),
      username: data.email || email,
      role: 'USER',
      name: data.name || name
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setToken(token);

    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token',token);

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
    localStorage.clear()
  };


  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    token
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