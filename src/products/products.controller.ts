import { Controller, Get } from '@nestjs/common';

@Controller()
export class ProductsController {
  @Get('/api/products')
  public getAllProducts() {
    return [
      { id: 1, title: 'book_1', price: 10 },
      { id: 2, title: 'book_2', price: 20 },
      { id: 3, title: 'book_3', price: 30 },
    ];
  }
}
