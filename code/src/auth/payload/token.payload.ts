export class TokenPayload {
  readonly sub: number;
  readonly username?: string;
  readonly isRefreshToken?: boolean;
}
