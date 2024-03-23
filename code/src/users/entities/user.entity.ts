import { Role } from 'src/auth/entities/roles.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    comment: '用户ID，主键',
  })
  id: number;

  @Column({
    length: 50,
    unique: true,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '用户昵称',
  })
  nickname: string;

  @Column({
    name: 'password_hash',
    length: 255,
    comment: '加密后的密码',
  })
  passwordHash: string;

  @Column({
    name: 'role_id',
    nullable: true,
    comment: '关联角色表的外键',
  })
  roleId: number | null;

  @Column({
    name: 'additional_info',
    type: 'json',
    nullable: true,
    comment: '存储JSON格式的额外信息',
  })
  additionalInfo: any;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
    comment: '记录创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    comment: '记录更新时间',
  })
  updatedAt: Date;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
