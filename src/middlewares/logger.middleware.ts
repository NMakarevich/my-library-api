import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: any, res: any, next: () => void) {
    const { body, method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      if (Math.floor(statusCode / 100) === 2) {
        this.logger.log(`${method} ${originalUrl} ${JSON.stringify(body)} - ${statusCode}`);
      } else {
        this.logger.error(`${method} ${originalUrl} ${JSON.stringify(body)} - ${statusCode}`);
      }
    });
    next();
  }
}
