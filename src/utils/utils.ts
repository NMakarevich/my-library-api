import { mkdir, rm, writeFile } from 'fs/promises';
import * as path from 'path';
import 'dotenv/config';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function savePhoto(file: Express.Multer.File, directory: string) {
  const fileExt = file.originalname.split('.').pop();
  const photoURL = `uploads/${directory}/${uuid()}.${fileExt}`;
  await mkdir(path.join(process.cwd(), `uploads/${directory}`), { recursive: true });
  await writeFile(photoURL, file.buffer);
  return photoURL;
}

export async function generateHash(password: string) {
  const saltOrRounds = parseInt(process.env.SALT_OR_ROUNDS) ?? 10;
  return await bcrypt.hash(password, saltOrRounds);
}

export async function compareHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function deleteFile(photoURL: string) {
  if (photoURL) {
    try {
      await rm(photoURL);
    } catch {}
  }
}
