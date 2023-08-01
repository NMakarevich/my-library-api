import { Transform } from 'class-transformer';

export class PaginationQueryEntity {
  @Transform(({ value }) => parseInt(value))
  offset: number;

  @Transform(({ value }) => parseInt(value))
  limit: number;
}
