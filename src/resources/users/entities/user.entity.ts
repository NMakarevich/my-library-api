import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Book } from '../../books/entities/book.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  photoURL: string;

  @ManyToMany(() => Book, (book) => book.users)
  @JoinTable()
  books: Book[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
