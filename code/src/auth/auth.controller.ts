import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  RefreshTokenDto,
  RegisterUserDto,
} from './dto/login.dto';
import { ErrorCode } from 'src/common/consts/error-codes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from './responses/login.reponses';
import { RefreshResponse } from './responses/refresh.responses';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: '用户登录' })
  async signIn(@Body() signInDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('/refresh')
  @ApiOperation({ summary: '刷新token' })
  async refresh(@Body() refreshDto: RefreshTokenDto): Promise<RefreshResponse> {
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

  @Post('/register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    return this.authService.register(registerDto);
  }
}
