import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  @Get('/api/users')
  getAllUsers() {
    return [
      { id: 1, email: 'matthewadel@yahoo.com' },
      { id: 2, email: 'matthewadel@gmail.com' },
    ];
  }
}
