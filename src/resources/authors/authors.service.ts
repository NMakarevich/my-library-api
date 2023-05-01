import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { rm } from 'fs/promises';
import { savePhoto } from '../../utils/utils';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto, file) {
    const author = this.authorRepository.create(createAuthorDto);
    if (file) {
      const fileName = `${author.firstName}${author.lastName || ''}`;
      author.photoURL = await savePhoto(fileName, file, 'authors');
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
    if (author.photoURL && updateAuthorDto.photoURL === null) {
      try {
        await rm(author.photoURL);
      } catch {}
    }
    Object.assign(author, updateAuthorDto);
    if (file) {
      const fileName = `${author.firstName}${author.lastName || ''}`;
      author.photoURL = await savePhoto(fileName, file, 'authors');
    }
    return this.authorRepository.save(author);
  }

  async remove(id: string) {
    const author = await this.findOne(id);
    if (author.photoURL) {
      try {
        await rm(author.photoURL);
      } catch {}
    }
    return this.authorRepository.remove(author, {});
  }
}
