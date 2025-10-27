import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from '../prisma.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { moviesRequest } from './dto/movies.request';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

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

    return {
      data: movies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateMovieDto) {
    return this.prisma.movie.create({
      data,
      include: { director: true, genre: true },
    });
  }

  async update(id: number, data: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

    return this.prisma.movie.update({
      where: { id },
      data,
      include: { director: true, genre: true },
    });
  }

  async remove(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

    return this.prisma.movie.delete({ where: { id } });
  }
}
