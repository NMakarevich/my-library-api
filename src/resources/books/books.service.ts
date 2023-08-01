import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { AuthorsService } from '../authors/authors.service';
import { deleteFile, savePhoto } from '../../utils/utils';
import { UsersService } from '../users/users.service';
import { PaginationQueryEntity } from '../../utils/pagination-query.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  async create(createBookDto: CreateBookDto, userId, file: Express.Multer.File) {
    const book = this.bookRepository.create(createBookDto);
    book.createdUserId = userId;
    book.authors = await Promise.all(
      createBookDto.authorsIds.map((authorId) => this.authorsService.findOne(authorId)),
    );
    const user = await this.userService.findOne(userId);
    book.users.push(user);
    if (file) {
      book.coverURL = await savePhoto(file, 'books');
    }
    return this.bookRepository.save(book);
  }

  async findAll(authorId: string, query: PaginationQueryEntity) {
    const { offset = 0, limit = 10 } = query;
    return authorId
      ? await this.bookRepository.find({
          relations: { authors: true },
          where: { id: authorId },
          skip: offset * limit,
          take: limit,
        })
      : await this.bookRepository.find({
          relations: { authors: true },
          skip: offset * limit,
          take: limit,
        });
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { authors: true },
    });
    if (!book) throw new HttpException('Book is not found', HttpStatus.NOT_FOUND);
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto, file: Express.Multer.File) {
    const book = await this.findOne(id);
    if (updateBookDto.coverURL === null) {
      await deleteFile(book.coverURL);
      book.coverURL = null;
    }
    book.title = updateBookDto.title || book.title;
    book.publishedYear = updateBookDto.publishedYear || book.publishedYear;
    book.status = updateBookDto.status || book.status;
    if (file) {
      await deleteFile(book.coverURL);
      book.coverURL = await savePhoto(file, 'books');
    }
    if (updateBookDto.authorsIds) {
      book.authors = await Promise.all(
        updateBookDto.authorsIds.map((authorId) => this.authorsService.findOne(authorId)),
      );
    }
    return this.bookRepository.save(book);
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    await deleteFile(book.coverURL);
    return this.bookRepository.remove(book);
  }
}
