import { RegisterDto } from './dtos/register.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersServices } from './users.service';
import { LoginDto } from './dtos/login.dto';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersServices) {}
  @Post('register')
  public async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }
}
