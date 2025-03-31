import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

interface IProduct {
  id: number;
  title: string;
  price: number;
}
@Controller('api/products')
export class ProductsController {
  private _products: IProduct[] = [
    { id: 1, title: 'book_1', price: 10 },
    { id: 2, title: 'book_2', price: 20 },
    { id: 3, title: 'book_3', price: 30 },
  ];

  @Delete(':id')
  public deeleteProduct(@Param('id', ParseIntPipe) id: string) {
    const product = this._products.find((product) => product.id === +id);
    if (!product) throw new NotFoundException('Product Not Found');

    this._products = this._products.filter((product) => product.id !== +id);
    return { Message: 'product deleted successfully' };
  }

  @Put(':id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: string,
    @Body()
    body: UpdateProductDto,
  ) {
    const productIndex = this._products.findIndex(
      (product) => product.id === +id,
    );

    if (productIndex === -1) throw new NotFoundException('Product Not Found');

    this._products[productIndex] = { ...this._products[productIndex], ...body };
    return this._products[productIndex];
  }

  @Post()
  public createNewProduct(
    @Body()
    body: CreateProductDto,
  ) {
    const newProduct = {
      id: this._products.length + 1,
      ...body,
    };
    this._products.push(newProduct);
    return newProduct;
  }

  @Get()
  public getAllProducts() {
    return this._products;
  }

  @Get(':id')
  public getProductById(@Param('id', ParseIntPipe) id: string) {
    const product = this._products.find((product) => product.id === +id);
    if (!product) throw new NotFoundException('Product Not Found');
    return product;
  }
}
