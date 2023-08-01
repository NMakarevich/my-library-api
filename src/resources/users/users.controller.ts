import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteUserGuard } from './guards/delete-user.guard';
import { FILE_SIZE } from '../../utils/consts';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: PaginationQueryEntity) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/photo')
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
  updatePhoto(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserPhotoDto: UpdateUserPhotoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_SIZE }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.updatePhoto(id, updateUserPhotoDto, file);
  }

  @Patch(':id/data')
  @UseInterceptors(ClassSerializerInterceptor)
  updateData(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDataDto: UpdateUserDataDto,
  ) {
    return this.usersService.updateData(id, updateUserDataDto);
  }

  @Patch(':id/password')
  @UseInterceptors(ClassSerializerInterceptor)
  updatePassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @Patch(':id/book')
  @UseInterceptors(ClassSerializerInterceptor)
  updateBooks(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserBooksDto: UpdateUserBooksDto,
  ) {
    return this.usersService.updateBooks(id, updateUserBooksDto);
  }

  @Delete(':id')
  @UseGuards(DeleteUserGuard)
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.remove(id);
  }
}
