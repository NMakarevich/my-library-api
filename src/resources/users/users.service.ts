import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateHash, compareHash, savePhoto, deleteFile } from '../../utils/utils';
import { BooksService } from '../books/books.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserBooksDto } from './dto/update-user-books.dto';
import { UpdateUserPhotoDto } from './dto/update-user-photo.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => BooksService))
    private readonly bookService: BooksService,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const user = await this.findByUsername(createUserDto.username);
    if (user) throw new HttpException('User with such username is exist', HttpStatus.CONFLICT);
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

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateData(id: string, updateUserDataDto: UpdateUserDataDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDataDto);
    return this.userRepository.save(user);
  }

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    const user = await this.findOne(id);
    if (updateUserPasswordDto.oldPassword === updateUserPasswordDto.newPassword)
      throw new HttpException('Passwords must not match', HttpStatus.CONFLICT);
    const isMatch = await compareHash(updateUserPasswordDto.oldPassword, user.password);
    if (!isMatch) throw new HttpException('Incorrect old password', HttpStatus.CONFLICT);
    user.password = await generateHash(updateUserPasswordDto.newPassword);
    return this.userRepository.save(user);
  }

  async updateBooks(id: string, updateUserBooksDto: UpdateUserBooksDto) {
    const user = await this.findOne(id);
    if (updateUserBooksDto.bookId) {
      const book = await this.bookService.findOne(updateUserBooksDto.bookId);
      user.books.push(book);
    }
    if (updateUserBooksDto.deleteBookId)
      user.books = user.books.filter((book) => book.id !== updateUserBooksDto.deleteBookId);
    return this.userRepository.save(user);
  }

  async updatePhoto(id: string, updateUserPhotoDto: UpdateUserPhotoDto, file: Express.Multer.File) {
    const user = await this.findOne(id);
    if (updateUserPhotoDto.photoURL === null) {
      await deleteFile(user.photoURL);
      user.photoURL = null;
    }
    if (file) {
      await deleteFile(user.photoURL);
      user.photoURL = await savePhoto(file, 'users');
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await deleteFile(user.photoURL);
    return await this.userRepository.remove(user);
  }
}
