import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordService } from 'src/common/password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // 根据用户id查找用户
  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  // 根据用户名查找用户
  async findOneByName(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }
  // 验证用户名和密码是否匹配
  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.findOneByName(username);
    if (user) {
      const passwordMatches = await PasswordService.checkPasswordHash(
        pass,
        user.passwordHash,
      );
      if (passwordMatches) {
        return user;
      }
    }
    return null;
  }
  // 增加用户
  async addUser(
    username: string,
    nickname: string,
    password: string,
    roleId: number | null,
  ): Promise<User> {
    const passwordHash = await PasswordService.hashPassword(password);
    const newUser = this.userRepository.create({
      username,
      nickname,
      passwordHash,
      roleId: roleId,
    });
    return this.userRepository.save(newUser);
  }
  // 更新用户
  async updateUser(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }
}
