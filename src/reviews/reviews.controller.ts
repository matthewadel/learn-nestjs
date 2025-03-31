import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.services';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  public getAllProducts() {
    return this.reviewsService.getAllProducts();
  }
}
