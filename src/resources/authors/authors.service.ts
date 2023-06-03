import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { deleteFile, savePhoto } from '../../utils/utils';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto, userId: string, file: Express.Multer.File) {
    const author = this.authorRepository.create(createAuthorDto);
    author.createdUserId = userId;
    if (file) {
      author.photoURL = await savePhoto(file, 'authors');
    }
    return this.authorRepository.save(author);
  }

  findAll() {
    return this.authorRepository.find({ relations: { books: true } });
  }

  async findOne(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: { books: true },
    });
    if (!author) throw new HttpException('Author is not found', HttpStatus.NOT_FOUND);
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto, file: Express.Multer.File) {
    const author = await this.findOne(id);
    if (updateAuthorDto.photoURL === null) {
      await deleteFile(author.photoURL);
      author.photoURL = null;
    }
    Object.assign(author, updateAuthorDto);
    if (file) {
      await deleteFile(author.photoURL);
      author.photoURL = await savePhoto(file, 'authors');
    }
    return this.authorRepository.save(author);
  }

  async remove(id: string) {
    const author = await this.findOne(id);
    await deleteFile(author.photoURL);
    return this.authorRepository.remove(author, {});
  }
}
