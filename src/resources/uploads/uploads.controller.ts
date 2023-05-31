import { Controller, Get, Req } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get('**')
  getPhoto(@Req() req: Request) {
    return this.uploadsService.getPhoto(req.url);
  }
}
