import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entitty';
import { Repository } from 'typeorm';
import * as bcryprt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * register users (create new users)
   * @param registerDto data of the user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto) {
    const user = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (user) throw new BadRequestException('User Already Exist');

    const salt = await bcryprt.genSalt(10);
    const hasedPassword = await bcryprt.hash(registerDto.password, salt);
    const newUser = this.usersRepository.create({
      ...registerDto,
      password: hasedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  public async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new BadRequestException('invalid email or password');

    const isPasswordCorrect = await bcryprt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect)
      throw new BadRequestException('invalid email or password');
    return user;
  }
}
