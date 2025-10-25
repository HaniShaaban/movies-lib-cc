import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception', description: 'Title of the movie' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A mind-bending thriller',
    description: 'Synopsis',
    required: false,
  })
  @IsString()
  @IsOptional()
  synopsis?: string;

  @ApiProperty({ example: 2010, description: 'Year of release' })
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ example: 1, description: 'Director ID' })
  @IsInt()
  directorId: number;

  @ApiProperty({ example: 7, description: 'Genre ID' })
  @IsInt()
  genreId: number;
}
