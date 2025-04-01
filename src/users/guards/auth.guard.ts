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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (token && type === 'bearer') {
      try {
        const payload: { id: number; userType: UserType } =
          await this.jwtService.verifyAsync(token, {
            secret: this.config.get<string>('JWT_SECRET'),
          });

        req['user'] = payload;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException('Access Denied, Invalid Token');
      }
    } else throw new UnauthorizedException('Access Denied, No Token Provided');

    return true;
  }
}
