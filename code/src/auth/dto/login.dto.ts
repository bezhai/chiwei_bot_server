import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly username!: string;

  @IsNotEmpty()
  readonly password!: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  readonly refresh_token!: string;
}

export class RegisterUserDto {
  @IsNotEmpty()
  readonly username!: string;

  @IsNotEmpty()
  readonly password!: string;

  // @IsNotEmpty()
  // readonly email: string;
}
