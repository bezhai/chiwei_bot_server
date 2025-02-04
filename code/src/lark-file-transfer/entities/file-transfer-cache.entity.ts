import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('file_transfer_cache')
export class FileTransferCache {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255, name: 'message_id' })
  messageId: string;

  @Column({ length: 255, name: 'file_key' })
  fileKey: string;

  @Column({ length: 100 })
  destination: string;

  @Column({ length: 1024 })
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
