import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString()
  @ValidateIf((object) => object.oldPassword, {
    message: 'To change password required enter oldPassword and newPassword.',
  })
  @IsNotEmpty()
  newPassword: string;

  @IsDateString()
  @IsOptional()
  birthDate: string;

  @IsOptional()
  photoURL: null;

  @IsOptional()
  @IsString()
  bookId: string;

  @IsOptional()
  @IsString()
  deleteBookId: string;
}
