import { forwardRef, Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { AuthorsModule } from '../authors/authors.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorsModule, forwardRef(() => UsersModule)],
  exports: [BooksService],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
