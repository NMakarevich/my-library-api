import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export async function savePhoto(fileName: string, file: Express.Multer.File, directory: string) {
  const fileExt = file.originalname.split('.').pop();
  const photoURL = `./uploads/${directory}/${fileName}.${fileExt}`;
  await mkdir(path.join(process.cwd(), `uploads/${directory}`), { recursive: true });
  await writeFile(photoURL, file.buffer);
  return photoURL;
}
