import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsSetvice } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsSetvice) {}

  @Delete(':id')
  public deeleteProduct(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.deeleteProduct(id);
  }

  @Put(':id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: string,
    @Body()
    body: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, body);
  }

  @Post()
  public createNewProduct(
    @Body()
    body: CreateProductDto,
  ) {
    return this.productsService.createNewProduct(body);
  }

  @Get()
  public getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  public getProductById(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.getProductById(id);
  }
}
