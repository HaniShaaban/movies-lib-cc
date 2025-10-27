import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎬 Movie Library
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Browse Movies
          </Link>
          
   
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin" className="navbar-link">
              Admin Dashboard
            </Link>
          )}
          
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-info">
                  Welcome, {user?.name} ({user?.role})
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-link">
                  Login
                </Link>
                <Link to="/register" className="auth-link">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
