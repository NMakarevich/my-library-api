import { Controller, Get, Req } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Public()
  @Get('**')
  getPhoto(@Req() req: Request) {
    return this.uploadsService.getPhoto(req.url);
  }
}
