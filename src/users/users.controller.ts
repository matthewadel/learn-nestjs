import { RegisterDto } from './dtos/register.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersServices } from './users.service';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserType } from 'src/utils/enums';

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

  @Get('current-user')
  @UseGuards(AuthGuard)
  public async getUserById(
    @CurrentUser() payload: { id: number; userType: UserType },
  ) {
    const id: number = payload.id;
    return this.userService.getCurrentUser(id);
  }

  @Get()
  public getAllUsers() {
    return this.userService.getAllUsers();
  }
}
