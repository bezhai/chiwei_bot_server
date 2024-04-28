import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/common/consts/error-codes';
import { CustomHttpException } from 'src/common/exception/custom-http.exception';
import { UsersService } from 'src/users/users.service';
import { Payload } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(username, pass);
    if (!user) {
      throw new CustomHttpException(
        ErrorCode.UNAUTHORIZED,
        'user info error',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload: Payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(
        { sub: user.id, isRefreshToken: true },
        {
          expiresIn: '14d',
        },
      ),
    };
  }

  async refreshToken(userId: number): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new CustomHttpException(
        ErrorCode.UNAUTHORIZED,
        'user info error',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload: Payload = { sub: userId, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }

  async validateRefreshToken(refreshToken: string): Promise<number> {
    try {
      // 验证refresh_token
      const decoded = this.jwtService.verify(refreshToken);
      return decoded.sub;
    } catch (e) {
      // 如果验证失败（例如，token过期或签名不正确），抛出异常
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }
}
