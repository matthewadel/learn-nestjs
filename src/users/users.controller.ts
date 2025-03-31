import { Controller, Get } from '@nestjs/common';
import { UsersServices } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersServices) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
