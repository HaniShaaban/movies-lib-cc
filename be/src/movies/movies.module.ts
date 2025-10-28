import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { ElasticsearchService } from 'src/elasticsearch/es.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [MoviesController],
  providers: [MoviesService, PrismaService, ElasticsearchService],
})
export class MoviesModule {}
