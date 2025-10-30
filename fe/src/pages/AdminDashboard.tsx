import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Movie } from '../types/movie';
import MovieList from '../components/admin/MovieList';
import MovieForm from '../components/admin/MovieForm';
import UserManagement from '../components/admin/UserManagement.tsx';
import './AdminDashboard.css';
import { fetchMovies } from '../api/movies.api.ts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchMoviesFn = async () => {
    const moviesResponse: any = await fetchMovies();
    setMovies(moviesResponse?.data?.data)
    setLoading(false)
  }


  useEffect(() => {
    setLoading(true)
    fetchMoviesFn()
  }, []);


  const handleDeleteMovie = (movieId: string) => {
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your movie library.</p>
      </div>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <Link
            to="/admin/movies"
            className={`sidebar-link ${isActive('/admin/movies') ? 'active' : ''}`}
          >
            🎬 Movies
          </Link>
          <Link
            to="/admin/movies/new"
            className={`sidebar-link ${isActive('/admin/movies/new') ? 'active' : ''}`}
          >
            ➕ Add Movie
          </Link>
          <Link
            to="/admin/users"
            className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`}
          >
            👥 Users
          </Link>
        </nav>

        <main className="admin-content">
          <Routes>
            <Route
              path="/movies"
              element={
                <MovieList
                  movies={movies}
                  onDelete={handleDeleteMovie}
                />
              }
            />
            <Route
              path="/movies/new"
              element={
                <MovieForm
                  title="Add New Movie"
                />
              }
            />
            <Route
              path="/users"
              element={<UserManagement />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
