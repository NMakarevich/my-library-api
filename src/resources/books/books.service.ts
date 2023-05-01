import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { AuthorsService } from '../authors/authors.service';
import { savePhoto } from '../../utils/utils';
import { rm } from 'fs/promises';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
  ) {}
  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    const book = new Book();
    book.title = createBookDto.title;
    book.publishedYear = createBookDto.publishedYear;
    book.status = createBookDto.readStatus || book.status;
    book.authors = await Promise.all(
      createBookDto.authorsIds.map((authorId) => this.authorsService.findOne(authorId)),
    );
    if (file) {
      const fileName = createBookDto.title;
      book.coverURL = await savePhoto(fileName, file, 'books');
    }
    return this.bookRepository.save(book);
  }

  async findAll(authorId: string) {
    const books = await this.bookRepository.find({ relations: { authors: true } });
    return authorId
      ? books.filter((book) => book.authors.some((author) => author.id === authorId))
      : books;
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
    if (book.coverURL && updateBookDto.coverURL === null) {
      try {
        await rm(book.coverURL);
        book.coverURL = null;
      } catch {}
    }
    book.title = updateBookDto.title || book.title;
    book.publishedYear = updateBookDto.publishedYear || book.publishedYear;
    book.status = updateBookDto.readStatus || book.status;
    if (file) {
      const fileName = book.title;
      book.coverURL = await savePhoto(fileName, file, 'books');
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
    if (book.coverURL) {
      try {
        await rm(book.coverURL);
      } catch {}
    }
    return this.bookRepository.remove(book);
  }
}
