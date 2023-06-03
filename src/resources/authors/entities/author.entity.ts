import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { JoinTable } from 'typeorm';

@Entity('author')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  photoURL: string;

  @Column({ update: false })
  createdUserId: string;

  @ManyToMany(() => Book, (book) => book.authors, { cascade: true })
  @JoinTable()
  books: Book[];
}
