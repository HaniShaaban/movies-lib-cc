import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique username', example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password with minimum 6 characters',
    example: 'secret123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
