import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserType } from 'src/utils/enums';
import { Reflector } from '@nestjs/core';
import { UsersServices } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UsersServices,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return false;

    const req: Request = context.switchToHttp().getRequest();

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (token && type === 'bearer') {
      try {
        const payload: { id: number; userType: UserType } =
          await this.jwtService.verifyAsync(token, {
            secret: this.config.get<string>('JWT_SECRET'),
          });

        const user = await this.userService.getCurrentUser(payload.id);
        if (!user) return false;
        if (roles.includes(user.userType)) {
          req['user'] = payload;
          return true;
        }
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException('Access Denied, Invalid Token');
      }
    } else throw new UnauthorizedException('Access Denied, No Token Provided');

    return false;
  }
}
