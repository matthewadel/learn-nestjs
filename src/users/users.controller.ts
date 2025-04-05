import { RegisterDto } from './dtos/register.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersServices } from './users.service';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserType } from 'src/utils/enums';
import { Roles } from './decorators/user-role.decorator';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UpdateUserDto } from './dtos/update-users.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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
  public async getCurrentUser(
    @CurrentUser() payload: { id: number; userType: UserType },
  ) {
    const id: number = payload.id;
    return this.userService.getCurrentUser(id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Put()
  @UseGuards(AuthGuard)
  public async updateUser(
    @CurrentUser() payload: { id: number; userType: UserType },
    @Body() loginDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(payload.id, loginDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: { id: number; userType: UserType },
  ) {
    return this.userService.deleteUser(id, payload);
  }

  @Get('verify-email/:userId/:verificationToken')
  public VerifyEmail(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.userService.VerifyEmail(userId, verificationToken);
  }

  @Post('fortget-password')
  public forgetPassword(@Body() body: { email: string }) {
    return this.userService.sendResetPasswordLink(body.email);
  }

  @Post('reset-password')
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.userService.resetPassword(body);
  }
}
