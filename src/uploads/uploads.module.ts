import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.services';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UploadsController],
  imports: [MulterModule.register(), JwtModule],
  providers: [UploadsService],
})
export class UploadsModule {}
