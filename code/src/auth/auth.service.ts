import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/common/consts/error-codes';
import { CustomHttpException } from 'src/common/exception/custom-http.exception';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './responses/login.reponses';
import { RefreshResponse } from './responses/refresh.responses';
import { TokenPayload } from './payload/token.payload';
import { RegisterUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const user = await this.usersService.findOneByName(registerDto.username);
    if (user) {
      throw new CustomHttpException(
        ErrorCode.USER_ALREADY_EXISTS,
        'user exist',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.usersService.addUser(
        registerDto.username,
        '',
        registerDto.password,
        null,
      );
    }
  }

  async signIn(username: string, pass: string): Promise<LoginResponse> {
    const user = await this.usersService.validateUser(username, pass);
    if (!user) {
      throw new CustomHttpException(
        ErrorCode.UNAUTHORIZED,
        'user info error',
        HttpStatus.BAD_REQUEST,
      );
    }
    const accessPayload: TokenPayload = {
      sub: user.id,
      username: user.username,
    };
    const refreshPayload: TokenPayload = {
      sub: user.id,
      isRefreshToken: true,
    };
    return {
      access_token: await this.jwtService.signAsync(accessPayload),
      refresh_token: await this.jwtService.signAsync(refreshPayload, {
        expiresIn: '21d',
      }),
    };
  }

  async refreshToken(userId: number): Promise<RefreshResponse> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new CustomHttpException(
        ErrorCode.UNAUTHORIZED,
        'user info error',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload: TokenPayload = { sub: userId, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }

  async validateRefreshToken(refreshToken: string): Promise<number> {
    try {
      // 验证refresh_token
      const decoded: TokenPayload = this.jwtService.verify(refreshToken);
      if (decoded.isRefreshToken !== true) {
        throw new Error(); // 这里抛出一个基本错误是因为外层都会catch住的
      }
      return decoded.sub;
    } catch (e) {
      // 如果验证失败（例如，token过期或签名不正确），抛出异常
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }
}
