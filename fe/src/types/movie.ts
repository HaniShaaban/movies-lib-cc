export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  genre: {
    id: number,
    name: string
  };
  director: {
    id: number,
    name: string
  };
  cover?: string;
}

export interface CreateMovieData {
  title: string;
  synopsis: string;
  year: number;
  genreId: number
  directorId: number;
  cover?: string;
}

export interface UpdateMovieData extends Partial<CreateMovieData> {
  id: string;
}
