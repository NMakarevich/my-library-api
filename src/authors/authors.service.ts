import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { mkdir, writeFile, access, rm } from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto, file) {
    const author = this.authorRepository.create(createAuthorDto);
    if (file) {
      author.photoURL = await writePhoto(author, file);
    }
    return this.authorRepository.save(author);
  }

  findAll() {
    return this.authorRepository.find();
  }

  async findOne(id: string) {
    const author = await this.authorRepository.findOne({ where: { id } });
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
      author.photoURL = await writePhoto(author, file);
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
    return this.authorRepository.delete(id);
  }
}

const writePhoto = async (author: Author, file: Express.Multer.File) => {
  const fileName = `${author.firstName}${author.lastName || ''}`;
  const fileExt = file.originalname.split('.').pop();
  const photoURL = `./uploads/${fileName}.${fileExt}`;
  await mkdir(path.join(process.cwd(), 'uploads'), { recursive: true });
  await writeFile(photoURL, file.buffer);
  return photoURL;
};
