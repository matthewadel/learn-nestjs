import { UserType } from './../utils/enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entitty';
import { Repository } from 'typeorm';
import * as bcryprt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    await this.usersRepository.save(newUser);

    const accessToken = await this.generateJWT({
      id: newUser.id,
      userType: newUser.userType,
    });
    return { accessToken };
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

    const accessToken = await this.generateJWT({
      id: user.id,
      userType: user.userType,
    });
    return { accessToken };
  }

  private async generateJWT(payload: {
    id: number;
    userType: UserType;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
