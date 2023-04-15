import { DataSource } from 'typeorm';
import { env } from 'process';
import 'dotenv/config';

export const ormconfig = new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: parseInt(env.POSTGRES_PORT),
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
