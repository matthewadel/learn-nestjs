import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface IProduct {
  id: number;
  title: string;
  price: number;
}

@Injectable()
export class ProductsSetvice {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  public async getOneBy(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product Not Found');
    return product;
  }

  public async createNewProduct(createProductDto: CreateProductDto) {
    const newProduct = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(newProduct);
  }

  public async getAllProducts() {
    return await this.productsRepository.find();
  }

  public async getProductById(id: number) {
    return await this.getOneBy(id);
  }

  public async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.getOneBy(id);

    product = { ...product, ...updateProductDto };
    return await this.productsRepository.save(product);
  }

  public async deleteProduct(id: number) {
    await this.getOneBy(id);

    await this.productsRepository.delete({ id: id });
    return { Message: 'product deleted successfully' };
  }
}
