import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  public getAllProducts() {
    return [
      { id: 1, rating: 4, comment: 'good' },
      { id: 2, rating: 5, comment: 'very good' },
    ];
  }
}
