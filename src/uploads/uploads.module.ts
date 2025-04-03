import { BadRequestException, Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.services';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { diskStorage } from 'multer';

@Module({
  controllers: [UploadsController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'images',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const filename = `${prefix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) cb(null, true);
        else cb(new BadRequestException('unsupported file format'), false);
      },
      // limits: { fileSize: 1024 * 1024 }, // in bytes, 1 mb
    }),
    JwtModule,
  ],
  providers: [UploadsService],
})
export class UploadsModule {}
