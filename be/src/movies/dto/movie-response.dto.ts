import { ApiProperty } from '@nestjs/swagger';

export class DirectorResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

export class GenreResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

export class MovieResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  synopsis: string | null;
  year: number;
  @ApiProperty()
  cover: string | null;
  createdAt: Date;
  @ApiProperty()
  director: DirectorResponseDto;
  @ApiProperty()
  genre: GenreResponseDto;
}

export class PaginatedMoviesResponseDto {
  @ApiProperty({ type: [MovieResponseDto] })
  data: MovieResponseDto[];

  @ApiProperty({
    example: { total: 100, page: 1, limit: 10 },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
