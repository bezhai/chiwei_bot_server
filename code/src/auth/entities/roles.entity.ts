import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({
    comment: '角色ID，主键',
  })
  id: number;

  @Column({
    length: 50,
    comment: '角色名称',
  })
  name: string;
}
