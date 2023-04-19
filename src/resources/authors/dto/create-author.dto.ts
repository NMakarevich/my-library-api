import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
