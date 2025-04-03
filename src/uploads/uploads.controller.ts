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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
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

  @Get(':imageurl')
  public showImage(@Param('imageurl') imageurl: string, @Res() res: Response) {
    return res.sendFile(imageurl, { root: 'images' });
  }
}
