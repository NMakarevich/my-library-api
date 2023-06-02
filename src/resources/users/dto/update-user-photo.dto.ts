import { IsOptional } from 'class-validator';

export class UpdateUserPhotoDto {
  @IsOptional()
  photoURL: null;

  @IsOptional()
  file: any;
}
