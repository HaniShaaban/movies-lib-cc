import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import './MovieList.css';
import axios from 'axios';

interface MovieListProps {
  movies: Movie[];
  onDelete: (movieId: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onDelete }) => {


    const handleDelete = async (movieId: string, movieTitle: string) => {
      if (!window.confirm(`Are you sure you want to delete "${movieTitle}"? This action cannot be undone.`)) {
        return;
      }

      const token = localStorage.getItem('token');

      try {
        await axios.delete(`http://localhost:3000/movies/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Optional: remove the movie from your local state after deletion
        onDelete(movieId);
        alert(`"${movieTitle}" was deleted successfully.`);
      } catch (error) {
        console.error('Failed to delete movie:', error);
        alert('Failed to delete movie. Please try again.');
      }
    };


  return (
    <div className="movie-list">
      <div className="movie-list-header">
        <h2>Movie Management</h2>
        <Link to="/admin/movies/new" className="add-movie-btn">
          ➕ Add New Movie
        </Link>
      </div>

      <div className="movies-table-container">
        <table className="movies-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Director</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id}>
                <td className="poster-cell">
                  {movie.cover ? (
                    <img 
                      src={movie.cover} 
                      alt={movie.title}
                      className="movie-poster-thumb"
                    />
                  ) : (
                    <div className="no-poster-thumb">No Image</div>
                  )}
                </td>
                <td className="title-cell">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-description">{movie.synopsis}</div>
                </td>
                <td className="director-cell">{movie.director.name}</td>
                <td className="year-cell">{movie.year}</td>
                <td className="genre-cell">{movie.genre.name}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    
                    <button 
                      onClick={() => handleDelete(movie.id, movie.title)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {movies.length === 0 && (
          <div className="no-movies">
            <p>No movies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
