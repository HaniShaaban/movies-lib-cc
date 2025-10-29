import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from '../prisma.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { moviesRequest } from './dto/movies.request';
import { MovieResponseDto } from './dto/movie-response.dto';
import { ElasticsearchService } from 'src/elasticsearch/es.service';
import { transformMovieToESDocument } from 'src/elasticsearch/es.helper';
import { MovieESDocument } from 'src/elasticsearch/es.types';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly esService: ElasticsearchService,
  ) {}
  async indexAllMovies() {
    try {
      const movies = await this.prisma.movie.findMany({
        include: {
          director: true,
          genre: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const moviesEsDocs: MovieESDocument[] = transformMovieToESDocument(
        movies,
      ) as MovieESDocument[];
      await this.esService.bulkIndexMovies(moviesEsDocs);

      return true;
    } catch (error) {
      this.logger.error('Failed to index movies', error.stack);
      throw new BadRequestException('Failed to index movies');
    }
  }

  async search(params: moviesRequest, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { query } = params;

    const { data, meta } = await this.esService.searchMovies(
      query,
      skip,
      limit,
    );

    return {
      data,
      meta,
    };
  }

  async findAll(params: moviesRequest, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { query, genreId, directorId } = params;

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { synopsis: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (directorId) {
      where.directorId = directorId;
    }

    if (genreId) {
      where.genreId = genreId;
    }

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        skip,
        take: limit,
        where,
        include: {
          director: true,
          genre: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    const moviesResponse = movies.map(
      (movie) =>
        ({
          id: movie.id,
          title: movie.title,
          synopsis: movie.synopsis,
          year: movie.year,
          cover: movie.cover,
          createdAt: movie.createdAt,
          director: {
            id: movie.director.id,
            name: movie.director.name,
          },
          genre: {
            id: movie.genre.id,
            name: movie.genre.name,
          },
        }) as MovieResponseDto,
    );

    return {
      data: moviesResponse,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateMovieDto) {
    try {
      const [genre, director] = await Promise.all([
        this.prisma.genre.findUnique({ where: { id: data.genreId } }),
        this.prisma.director.findUnique({ where: { id: data.directorId } }),
      ]);

      if (!genre) {
        throw new NotFoundException(`Genre with ID ${data.genreId} not found`);
      }

      if (!director) {
        throw new NotFoundException(
          `Director with ID ${data.directorId} not found`,
        );
      }

      const newMovie = await this.prisma.movie.create({
        data,
        include: { director: true, genre: true },
      });

      const newMovieESDoc: MovieESDocument = transformMovieToESDocument(
        newMovie,
      ) as MovieESDocument;
      await this.esService.indexMovie(newMovieESDoc);

      return newMovie;
    } catch (error) {
      this.logger.error('Failed to create movie', error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create movie');
    }
  }

  async update(id: number, data: UpdateMovieDto) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

      return this.prisma.movie.update({
        where: { id },
        data,
        include: { director: true, genre: true },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update movie');
    }
  }

  async remove(id: number) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

      return this.prisma.movie.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Failed to remove movies', error.stack);
      throw new BadRequestException('Failed to delete movie');
    }
  }
}
