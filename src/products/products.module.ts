import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsSetvice } from './products.service';

@Module({ controllers: [ProductsController], providers: [ProductsSetvice] })
export class ProductsModule {}
