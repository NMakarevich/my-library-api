import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReadStatus } from '../entities/book.entity';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  publishedYear: number;

  @IsArray()
  @IsOptional()
  authorsIds: string[];

  @IsEnum(ReadStatus)
  @IsOptional()
  readStatus: ReadStatus;

  @IsOptional()
  coverURL: null;
}
