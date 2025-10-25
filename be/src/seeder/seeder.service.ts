import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { staticSeed } from '../constant';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaClient) {}

  async run() {
    console.log('🚀 Seeding database...');

    await this.prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Movie" RESTART IDENTITY CASCADE`,
    );
    await this.prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Director" RESTART IDENTITY CASCADE`,
    );
    await this.prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Genre" RESTART IDENTITY CASCADE`,
    );

    await this.prisma.genre.createMany({
      data: staticSeed.genres,
      skipDuplicates: true,
    });

    await this.prisma.director.createMany({
      data: staticSeed.directors,
      skipDuplicates: true,
    });

    const moviesData = [];
    for (let i = 0; i < 200; i++) {
      moviesData.push({
        title: faker.lorem.words(3),
        synopsis: faker.lorem.sentences(2),
        year: faker.number.int({ min: 1970, max: 2025 }),
        cover: 'https://picsum.photos/200',
        directorId: faker.number.int({ min: 1, max: 10 }),
        genreId: faker.number.int({ min: 1, max: 10 }),
      });
    }

    const batchSize = 50;
    for (let i = 0; i < moviesData.length; i += batchSize) {
      const batch = moviesData.slice(i, i + batchSize);
      await this.prisma.movie.createMany({ data: batch });
    }

    console.log('✅ Seed completed!');
  }
}
