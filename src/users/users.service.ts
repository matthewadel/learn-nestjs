import { ReviewsService } from './../reviews/reviews.services';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class UsersServices {
  constructor(
    @Inject(forwardRef(() => ReviewsService))
    private reviewsService: ReviewsService,
  ) {}
  public getAllUsers() {
    return [
      { id: 1, email: 'matthewadel@yahoo.com' },
      { id: 2, email: 'matthewadel@gmail.com' },
    ];
  }
}
