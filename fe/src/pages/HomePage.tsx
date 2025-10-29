import React, { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';
import './HomePage.css';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { genresStatic } from '../assets/staticContent/genres.static';
import { directorsStatic } from '../assets/staticContent/directors.static';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterDirector, setFilterDirector] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const params: any = {
          page: 1,
          limit: 10
        };
        if (filterGenre) params.genreId = filterGenre;
        if (filterDirector) params.directorId = filterDirector;
        if (debouncedSearchTerm) params.query = debouncedSearchTerm;
        
        const response = await axios.get<{data: Movie[]}>('http://localhost:3000/movies', { params });
        setMovies(response.data?.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearchTerm, filterGenre, filterDirector]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // wait 500ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);



  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Movie Library</h1>
        <p>Discover your favorite movies</p>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies or directors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="genre-filter"
          >
            <option value="">All Genres</option>
           {genresStatic.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <select
            value={filterDirector}
            onChange={(e) => setFilterDirector(e.target.value)}
            className="genre-filter"
          >
            <option value="">All Directors</option>
          {directorsStatic.map(director => (
            <option key={director.id} value={director.id}>
              {director.name}
            </option>
          ))}
          </select>
        </div>
      </div>

        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
    </div>
  );
};

export default HomePage;
