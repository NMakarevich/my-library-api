import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {
  getPhoto(url: string) {
    const file = createReadStream(join(process.cwd(), url));
    return new StreamableFile(file);
  }
}
