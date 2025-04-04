import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User } from './user.entitty';
import * as bcryprt from 'bcryptjs';
import { UserType } from 'src/utils/enums';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private mailService: MailService,
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

    // await this.mailService.sendEloginMail(user.email, user.username);

    return { accessToken };
  }

  public async hashPassword(password: string) {
    const salt = await bcryprt.genSalt(10);
    return await bcryprt.hash(password, salt);
  }

  private async generateJWT(payload: {
    id: number;
    userType: UserType;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
