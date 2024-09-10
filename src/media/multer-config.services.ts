import { BadRequestException } from '@nestjs/common';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';

export class MulterConfigService implements MulterOptionsFactory {
  getStorage() {
    return diskStorage({
      destination: './upload',
      filename: (_req, file, callback) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + ext);
      },
    });
  }
  fileFilter(_req, file, callback) {
    if (!file.originalname.match(/\.jpg|jpeg|png|webp/)) {
      return callback(
        new BadRequestException('Only images files are authorized'),
        false,
      );
    }
    callback(null, true);
  }
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: this.getStorage(),
      fileFilter: this.fileFilter,
    };
  }
}
