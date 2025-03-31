import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsSetvice } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsSetvice],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
