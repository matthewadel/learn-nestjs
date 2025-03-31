import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServices } from './users.service';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  controllers: [UsersController],
  providers: [UsersServices],
  exports: [UsersServices],
  imports: [forwardRef(() => ReviewsModule)],
})
export class UsersModule {}
