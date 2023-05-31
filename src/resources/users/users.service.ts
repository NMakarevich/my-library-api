import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateHash, compareHash, savePhoto, deleteFile } from '../../utils/utils';
import { BooksService } from '../books/books.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => BooksService))
    private readonly bookService: BooksService,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const newUser = this.userRepository.create(createUserDto);
    newUser.password = await generateHash(newUser.password);
    if (file) {
      newUser.photoURL = await savePhoto(file, 'users');
    }
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { books: true } });
    if (!user) throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const user = await this.findOne(id);
    if (updateUserDto.photoURL === null) {
      await deleteFile(user.photoURL);
      user.photoURL = null;
    }
    if (file) {
      await deleteFile(user.photoURL);
      user.photoURL = await savePhoto(file, 'users');
    }
    if (updateUserDto.oldPassword) {
      if (updateUserDto.oldPassword === updateUserDto.newPassword)
        throw new HttpException('Passwords must not match', HttpStatus.CONFLICT);
      const isMatch = await compareHash(updateUserDto.oldPassword, user.password);
      if (!isMatch) throw new HttpException('Incorrect old password', HttpStatus.CONFLICT);
      user.password = await generateHash(updateUserDto.newPassword);
    }
    if (updateUserDto.bookId) {
      const book = await this.bookService.findOne(updateUserDto.bookId);
      user.books.push(book);
    }
    if (updateUserDto.deleteBookId)
      user.books = user.books.filter((book) => book.id !== updateUserDto.deleteBookId);
    user.firstName = updateUserDto.firstName || user.firstName;
    user.lastName = updateUserDto.lastName || user.lastName;
    user.birthDate = updateUserDto.birthDate || user.birthDate;
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await deleteFile(user.photoURL);
    return await this.userRepository.remove(user);
  }
}
