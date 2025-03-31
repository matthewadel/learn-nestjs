import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersServices {
  public getAllUsers() {
    return [
      { id: 1, email: 'matthewadel@yahoo.com' },
      { id: 2, email: 'matthewadel@gmail.com' },
    ];
  }
}
