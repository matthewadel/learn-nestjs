import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.services';
import { UsersServices } from 'src/users/users.service';

@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
    private usersService: UsersServices,
  ) {}

  @Get()
  public getAllProducts() {
    return this.reviewsService.getAllProducts();
  }
}
