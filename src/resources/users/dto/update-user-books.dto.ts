import { IsOptional, IsString } from 'class-validator';

export class UpdateUserBooksDto {
  @IsOptional()
  @IsString()
  bookId: string;

  @IsOptional()
  @IsString()
  deleteBookId: string;
}
