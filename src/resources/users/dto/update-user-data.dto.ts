import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDataDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  lastName: string;

  @IsDateString()
  @IsOptional()
  birthDate: string;
}
