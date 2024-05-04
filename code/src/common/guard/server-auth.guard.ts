import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { generateToken } from '../utils/auth.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('HTTP_SECRET') || '';
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const salt = request.headers['x-salt'];
    const clientToken = request.headers['x-token'];

    if (!salt) {
      throw new HttpException('Missing salt', HttpStatus.FORBIDDEN);
    }

    if (!clientToken) {
      throw new HttpException('Missing token', HttpStatus.FORBIDDEN);
    }

    const bodyBytes = JSON.stringify(request.body);
    const serverToken = generateToken(salt, bodyBytes, this.secret);

    if (serverToken !== clientToken) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
