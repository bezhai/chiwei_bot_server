import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Payload } from './dto/payload.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('HTTP_JWT_KEY'),
    });
  }

  async validate(payload: Payload) {
    const userId = payload.sub;
    const user = await this.usersService.findOne(userId);

    if (!user) {
      return null;
    }

    return { userId: payload.sub, username: payload.username };
  }
}
