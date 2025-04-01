import { UserType } from './../utils/enums';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entitty';
import { Repository } from 'typeorm';
import * as bcryprt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dtos/update-users.dto';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
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

    const newUser = this.usersRepository.create({
      ...registerDto,
      password: await this.hashPassword(registerDto.password),
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
        user.password = await this.hashPassword(updateUserDto.password);

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

  private async generateJWT(payload: {
    id: number;
    userType: UserType;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private async hashPassword(password: string) {
    const salt = await bcryprt.genSalt(10);
    return await bcryprt.hash(password, salt);
  }
}
