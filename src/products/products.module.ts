import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsSetvice } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductsSetvice],
  imports: [TypeOrmModule.forFeature([Product]), UsersModule, JwtModule],
  exports: [ProductsSetvice],
})
export class ProductsModule {}
