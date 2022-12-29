import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { User } from './user.entity';

@Entity()
export class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.enterprises)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Client, client => client.enterprises)
  @JoinColumn()
  client: Client;

  @Column({ default: 1 })
  enterpriseID!: number;

  @Column({ default: 'Default' })
  enterpriseName!: string;

  @Column({
    type: 'enum',
    enum: [0, 1],
    default: 1,
  })
  status!: number;

  @VersionColumn({ select: false })
  version: number;

  @CreateDateColumn({ nullable: true })
  createdOn?: Date;

  @Column({ nullable: true, select: false })
  createdBy?: string;

  @UpdateDateColumn({ nullable: true, select: false })
  updatedOn?: Date;

  @Column({ nullable: true, select: false })
  updatedBy?: string;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedOn?: Date;

  @Column({ nullable: true, select: false })
  deletedBy?: string;
}
