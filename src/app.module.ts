import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot({ ...ormconfig.options }), AuthorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
