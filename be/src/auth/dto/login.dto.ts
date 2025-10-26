import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email', example: 'test@test.com' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', example: 'test@test.com' })
  password: string;
}
