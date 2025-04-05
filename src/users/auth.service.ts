import { ResetPasswordDto } from './dtos/reset-password.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User } from './user.entitty';
import * as bcryprt from 'bcryptjs';
import { UserType } from 'src/utils/enums';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

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
      verificationToken: randomBytes(32).toString('hex'),
    });
    await this.usersRepository.save(newUser);

    // const accessToken = await this.generateJWT({
    //   id: newUser.id,
    //   userType: newUser.userType,
    // });

    await this.mailService.sendVerificationMail(
      newUser.email,
      this.generateEmailLink(newUser.id, newUser.verificationToken),
    );

    return { Message: 'please check your email address to verify your email' };
  }

  public async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new BadRequestException('invalid email or password');
    if (!user.isAccountVertified) {
      await this.mailService.sendVerificationMail(
        user.email,
        this.generateEmailLink(user.id, user.verificationToken),
      );

      user.verificationToken = randomBytes(32).toString('hex');
      await this.usersRepository.save(user);
      return { Mesage: 'Please verify your email address' };
    }

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

    await this.mailService.sendEloginMail(user.email, user.username);

    return { accessToken };
  }

  public async hashPassword(password: string) {
    const salt = await bcryprt.genSalt(10);
    return await bcryprt.hash(password, salt);
  }

  public async verifyEmail(userId: number, verifiationToken: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('No User Found');
    if (user.verificationToken !== verifiationToken)
      throw new BadRequestException('invalid Verification token');

    user.isAccountVertified = true;
    user.verificationToken = '';
    await this.usersRepository.save(user);
    return { Message: 'your email has been verified successfully' };
  }

  public async sendResetPasswordLink(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) throw new NotFoundException('No User Found');

    user.resetPasswordToken = randomBytes(32).toString('hex');
    await this.usersRepository.save(user);

    await this.mailService.sendResetPasswordTemplate(
      email,
      this.generateEmailLink(user.id, user.resetPasswordToken),
    );

    return { Message: 'please check your email to reset your password' };
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { id: resetPasswordDto.userId },
    });

    if (!user) throw new NotFoundException('No User Found');
    if (user.resetPasswordToken !== resetPasswordDto.resetPasswordToken)
      throw new BadRequestException('invalid reset password token');

    user.password = await this.hashPassword(resetPasswordDto.newPassword);
    user.resetPasswordToken = '';
    await this.usersRepository.save(user);
    return { Message: 'your password has been reset successfully' };
  }

  private async generateJWT(payload: {
    id: number;
    userType: UserType;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private generateEmailLink(id: number, verificationToken: string) {
    return `localhost:3000/api/users/verify-email/${id}/${verificationToken}`;
  }
}
