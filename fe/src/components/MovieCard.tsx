import React from 'react';
import type { Movie } from '../types/movie';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.cover ? (
          <img src={movie.cover} alt={movie.title} />
        ) : (
          <div className="no-poster">
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-director">by {movie.director?.name}</p>
        <p className="movie-year">{movie.year}</p>
        <p className="movie-genre">{movie.genre?.name}</p>
        
        <div className="movie-description">
          <p>{movie.synopsis}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
