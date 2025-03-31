import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
  imports: [forwardRef(() => UsersModule)],
})
export class ReviewsModule {}
