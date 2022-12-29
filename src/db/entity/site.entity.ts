import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Role } from './role.entity';

@Entity()
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name!: string;

  @Column()
  ip!: string;

  @Column()
  port!: number;

  @Column({ nullable: true })
  url!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: [1, 2],
    default: 1,
  })
  type: number;

  @OneToMany(() => Role, role => role.site)
  roles: Role[];

  @ManyToMany(() => Client, client => client.sites)
  @JoinColumn()
  clients: Client[];

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
