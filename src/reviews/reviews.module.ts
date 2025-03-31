import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.services';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
