import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from '../prisma.service';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        skip,
        take: limit,
        include: {
          director: true,
          genre: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.movie.count(),
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
