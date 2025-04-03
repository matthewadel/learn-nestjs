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
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { AuthGuard } from 'src/users/guards/auth.guard';

@Controller('api/uploads')
export class UploadsController {
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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

  @Post('multiple-files')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  public uploadMultiplleFile(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    if (!files || !files?.length)
      throw new BadRequestException('No Files Provided');
    console.log(files);
    return {
      Message: 'Files Uploaded Successfully',
      paths: files.map((file) => file.path.replace('images', '')),
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
