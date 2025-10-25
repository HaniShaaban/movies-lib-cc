import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsInt()
  year: number;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsInt()
  directorId: number;

  @IsInt()
  genreId: number;
}
