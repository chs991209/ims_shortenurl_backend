import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
@Entity({ name: 'urls' })
export class Url {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'integer', nullable: true })
  user_id: number | null;

  @Column({ type: 'varchar', nullable: false, length: 767 })
  original_url: string;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 255 })
  shortened_url: string;

  @Column({ type: 'text', nullable: false })
  qr_code: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  created_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
