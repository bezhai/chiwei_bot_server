import * as bcrypt from 'bcryptjs';

export class PasswordService {
  // 加密密码
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // 校验密码
  static async checkPasswordHash(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
