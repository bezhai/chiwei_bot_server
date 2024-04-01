import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
