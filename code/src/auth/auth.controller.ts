import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RefreshTokenDto } from './dto/login.dto';
import { ErrorCode } from 'src/common/consts/error-codes';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto): Promise<any> {
    try {
      const refreshToken = refreshDto.refresh_token;

      // 验证refresh_token并提取用户ID
      const userId = await this.authService.validateRefreshToken(refreshToken);

      if (!userId) {
        throw new UnauthorizedException();
      }

      // 使用AuthService中的refreshToken方法来获取新的access_token
      return this.authService.refreshToken(userId);
    } catch (error) {
      // 如果在过程中出现任何错误，抛出UnauthorizedException
      throw new UnauthorizedException({
        errorCode: ErrorCode.UNAUTHORIZED,
        message: 'Invalid refresh token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
