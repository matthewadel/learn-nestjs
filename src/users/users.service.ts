import { AuthService } from './auth.service';
import { UserType } from './../utils/enums';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entitty';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-users.dto';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  public async register(registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  public async login(loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  public async getCurrentUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  public async getAllUsers() {
    return this.usersRepository.find();
  }

  public async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) {
      if (updateUserDto.username) user.username = updateUserDto.username;
      if (updateUserDto.password)
        user.password = await this.authService.hashPassword(
          updateUserDto.password,
        );

      return await this.usersRepository.save(user);
    }
  }

  public async deleteUser(
    id: number,
    payload: { id: number; userType: UserType },
  ) {
    const user = await this.getCurrentUser(id);

    if (id === user.id || payload.userType === UserType.ADMIN) {
      await this.usersRepository.delete({ id });
      return { message: 'User Deleted Successfully' };
    }
    throw new UnauthorizedException(
      'You Are Not Allowed To Perform This Action',
    );
  }
}
