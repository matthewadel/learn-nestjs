import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.services';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserType } from 'src/utils/enums';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':productId')
  @UseGuards(AuthGuard)
  public createReview(
    @Body() body: CreateReviewDto,
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() payload: { id: number; userType: UserType },
  ) {
    return this.reviewsService.createReview(productId, payload.id, body);
  }
}
