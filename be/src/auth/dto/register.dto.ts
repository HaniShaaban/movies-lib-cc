import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email', example: 'test@test.com' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'password', example: 'abe27sgasd27ads' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the user', example: 'user one' })
  name: string;
}
