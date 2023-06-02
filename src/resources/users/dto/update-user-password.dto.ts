import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString()
  @ValidateIf((object) => object.oldPassword, {
    message: 'To change password required enter oldPassword and newPassword.',
  })
  @IsNotEmpty()
  newPassword: string;
}
