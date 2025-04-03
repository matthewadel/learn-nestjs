import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Get,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Controller('api/uploads')
export class UploadsController {
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
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
      limits: { fileSize: 1024 * 1024 }, // in bytes, 1 mb
    }),
  )
  public uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No File Provided');
    console.log(file);
    return {
      Message: 'File Uploaded Successfully',
      path: file.path.replace('images', ''),
    };
  }

  @Get(':fileUrl')
  public downloadFile(@Param('fileUrl') fileUrl: string, @Res() res: Response) {
    return res.sendFile(fileUrl, { root: 'images' });
  }

  @Delete(':fileUrl')
  @UseGuards(AuthGuard)
  public deleteFile(@Param('fileUrl') fileUrl: string) {
    const filePath = join(process.cwd(), 'images', fileUrl);
    try {
      unlinkSync(filePath);
      return { Message: 'File Deleted Successfully' };
    } catch (e) {
      console.log(e);
      throw new NotFoundException("this file doesn't exist");
    }
  }
}
