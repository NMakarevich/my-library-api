import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './resources/authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';
import { BooksModule } from './resources/books/books.module';
import { UsersModule } from './resources/users/users.module';
import { UploadsModule } from './resources/uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig.options }),
    AuthorsModule,
    BooksModule,
    UsersModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
