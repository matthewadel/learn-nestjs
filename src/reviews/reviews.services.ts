import { UsersServices } from './../users/users.service';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(forwardRef(() => UsersServices))
    private usersServices: UsersServices,
  ) {}
  public getAllProducts() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 5, comment: 'very good' },
    ];
  }
}
