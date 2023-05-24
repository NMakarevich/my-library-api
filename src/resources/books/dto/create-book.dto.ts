import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReadStatus } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  publishedYear: number;

  @IsArray()
  authorsIds: string[];

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ReadStatus)
  @IsOptional()
  status: ReadStatus;
}
