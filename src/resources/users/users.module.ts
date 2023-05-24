import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BooksModule } from '../books/books.module';

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => BooksModule)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
