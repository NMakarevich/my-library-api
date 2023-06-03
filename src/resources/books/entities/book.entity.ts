import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { User } from '../../users/entities/user.entity';

export enum ReadStatus {
  'NOT_READ' = 'notRead',
  'IN_READ' = 'inRead',
  'WILL_READ' = 'willRead',
  'DONE' = 'done',
}

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  publishedYear: number;

  @Column({ nullable: true })
  coverURL: string;

  @Column({ type: 'enum', enum: ReadStatus, default: ReadStatus.NOT_READ })
  status: ReadStatus;

  @Column({ update: false })
  createdUserId: string;

  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];

  @ManyToMany(() => User, (user) => user.books)
  users: User[];
}
