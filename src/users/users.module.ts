import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServices } from './users.service';
import { User } from './user.entitty';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersServices],
  exports: [UsersServices],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
