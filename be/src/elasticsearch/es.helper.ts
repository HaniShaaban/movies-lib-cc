import { MovieESDocument, MovieWithRelations } from './es.types';

export const transformMovieToESDocument = (
  movies: MovieWithRelations | MovieWithRelations[],
): MovieESDocument | MovieESDocument[] => {
  if (Array.isArray(movies)) {
    return movies.map((movie) => ({
      id: movie.id.toString(),
      title: movie.title,
      synopsis: movie.synopsis || '',
      year: movie.year,
      cover: movie.cover || '',
      director: movie.director?.name || '',
      genre: movie.genre?.name || '',
      createdAt: movie.createdAt,
    }));
  }

  return {
    id: movies.id.toString(),
    title: movies.title,
    synopsis: movies.synopsis || '',
    year: movies.year,
    cover: movies.cover || '',
    director: movies.director?.name || '',
    genre: movies.genre?.name || '',
    createdAt: movies.createdAt,
  };
};
