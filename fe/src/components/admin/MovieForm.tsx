import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateMovieData } from '../../types/movie';
import axios from 'axios';
import { genresStatic } from '../../assets/staticContent/genres.static';
import { directorsStatic } from '../../assets/staticContent/directors.static';
import './MovieForm.css';

interface MovieFormProps {
  title: string;
}

const MovieForm: React.FC<MovieFormProps> = ({ title }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateMovieData>({
    title: '',
    synopsis: '',
    year: new Date().getFullYear(),
    cover: '',
    directorId: 0,
    genreId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'year' || name === 'directorId' || name === 'genreId'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.synopsis.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }

    if (!formData.directorId) {
      setError('Director is required');
      setLoading(false);
      return;
    }

    if (!formData.genreId) {
      setError('Genre is required');
      setLoading(false);
      return;
    }

    if (formData.year < 1888 || formData.year > new Date().getFullYear() + 5) {
      setError('Please enter a valid release year');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3000/movies', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/admin/movies');
    } catch (err) {
      console.error(err);
      setError('Failed to save movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-form">
      <div className="form-header">
        <h2>{title}</h2>
        <button onClick={() => navigate('/admin/movies')} className="back-button">
          ← Back to Movies
        </button>
      </div>

      <form onSubmit={handleSubmit} className="movie-form-content">
        {error && <div className="error-message">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter movie title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="directorId">Director *</label>
            <select
              id="directorId"
              name="directorId"
              value={formData.directorId}
              onChange={handleChange}
              required
            >
              <option value={0}>Select a director</option>
              {directorsStatic.map(director => (
                <option key={director.id} value={director.id}>
                  {director.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Release Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min={1888}
              max={new Date().getFullYear() + 5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="genreId">Genre *</label>
            <select
              id="genreId"
              name="genreId"
              value={formData.genreId}
              onChange={handleChange}
              required
            >
              <option value={0}>Select a genre</option>
              {genresStatic.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="synopsis">Description *</label>
          <textarea
            id="synopsis"
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            required
            placeholder="Enter movie description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cover">Poster URL (optional)</label>
          <input
            type="url"
            id="cover"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            placeholder="Enter poster image URL"
          />
          {formData.cover && (
            <div className="poster-preview">
              <img
                src={formData.cover}
                alt="Poster preview"
                className="preview-image"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
