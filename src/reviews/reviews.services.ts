import { CreateReviewDto } from './dtos/create-review.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ProductsSetvice } from 'src/products/products.service';
import { UsersServices } from 'src/users/users.service';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { UserType } from 'src/utils/enums';

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

  public async getAllReviews() {
    return await this.reviewsRepository.find({ order: { createdAt: 'DESC' } });
  }

  public async updateReview(
    reviewId: number,
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.getOneBy(reviewId);

    if (review.user.id === userId) {
      review.comment = updateReviewDto.comment ?? review.comment;
      review.rating = updateReviewDto.rating ?? review.rating;

      return await this.reviewsRepository.save(review);
    } else
      throw new ForbiddenException('You Are Not Allowed To Update This Review');
  }

  public async deleteReview(
    reviewId: number,
    payload: { id: number; userType: UserType },
  ) {
    const review = await this.getOneBy(reviewId);

    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      return { Message: 'Review Deleted Successfully' };
    }

    throw new ForbiddenException('You Are Not Allowed To Delete This Review');
  }

  private async getOneBy(id: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (!review) throw new NotFoundException('No Review Found');

    return review;
  }
}
