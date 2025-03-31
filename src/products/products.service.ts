import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';

export interface IProduct {
  id: number;
  title: string;
  price: number;
}

@Injectable()
export class ProductsSetvice {
  private _products: IProduct[] = [
    { id: 1, title: 'book_1', price: 10 },
    { id: 2, title: 'book_2', price: 20 },
    { id: 3, title: 'book_3', price: 30 },
  ];

  public deeleteProduct(id: string) {
    const product = this._products.find((product) => product.id === +id);
    if (!product) throw new NotFoundException('Product Not Found');

    this._products = this._products.filter((product) => product.id !== +id);
    return { Message: 'product deleted successfully' };
  }

  public updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const productIndex = this._products.findIndex(
      (product) => product.id === +id,
    );

    if (productIndex === -1) throw new NotFoundException('Product Not Found');

    this._products[productIndex] = {
      ...this._products[productIndex],
      ...updateProductDto,
    };
    return this._products[productIndex];
  }

  public createNewProduct(createProductDto: CreateProductDto) {
    const newProduct = {
      id: this._products.length + 1,
      ...createProductDto,
    };
    this._products.push(newProduct);
    return newProduct;
  }

  public getAllProducts() {
    return this._products;
  }

  public getProductById(id: string) {
    const product = this._products.find((product) => product.id === +id);
    if (!product) throw new NotFoundException('Product Not Found');
    return product;
  }
}
