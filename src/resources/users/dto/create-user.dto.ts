import { IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Username must contains 4 or more characters' })
  username: string;

  @IsDateString()
  @IsOptional()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must contains 6 or more characters' })
  password: string;
}
