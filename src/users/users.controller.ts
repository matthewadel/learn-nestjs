import { Controller, Get } from '@nestjs/common';
import { UsersServices } from './users.service';
import { ReviewsService } from 'src/reviews/reviews.services';

@Controller('api/users')
export class UsersController {
  constructor(
    private userService: UsersServices,
    private reviewsService: ReviewsService,
  ) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
