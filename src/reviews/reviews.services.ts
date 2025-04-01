import { CreateReviewDto } from './dtos/create-review.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ProductsSetvice } from 'src/products/products.service';
import { UsersServices } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productsSetvice: ProductsSetvice,
    private readonly usersServices: UsersServices,
  ) {}

  public async createReview(
    productId: number,
    userId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const product = await this.productsSetvice.getOneBy(productId);
    const user = await this.usersServices.getCurrentUser(userId);
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      user,
      product,
    });

    return await this.reviewsRepository.save(review);
  }
}
