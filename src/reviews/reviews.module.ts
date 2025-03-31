import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.services';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
