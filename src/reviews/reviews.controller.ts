import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.services';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UpdateReviewDto } from './dtos/update-review.dto';

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

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllReviews(
    @Query('page', ParseIntPipe) page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    return this.reviewsService.getAllReviews(page, itemsPerPage);
  }

  @Put(':reviewId')
  @UseGuards(AuthGuard)
  public updateReview(
    @Body() body: UpdateReviewDto,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentUser() payload: { id: number; userType: UserType },
  ) {
    return this.reviewsService.updateReview(reviewId, payload.id, body);
  }

  @Delete(':reviewId')
  @UseGuards(AuthGuard)
  public deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentUser() payload: { id: number; userType: UserType },
  ) {
    return this.reviewsService.deleteReview(reviewId, payload);
  }
}
