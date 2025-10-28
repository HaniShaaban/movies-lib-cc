import { Movie, Director, Genre } from '@prisma/client';

export type MovieWithRelations = Movie & {
  director?: Director | null;
  genre?: Genre | null;
};

export type MovieESDocument = {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  cover: string;
  director: string;
  genre: string;
  createdAt: Date;
};
