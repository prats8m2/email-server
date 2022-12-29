import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Enterprise } from './enterprise.entity';
// Table: User
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  username!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  authToken?: string;

  @Column({ nullable: true, type: 'bigint' })
  lastLogin?: number;

  @Column({ nullable: false, default: false })
  isFirstLogin: boolean;

  //if the user has changed password then it becomes false
  @Column({ nullable: true, default: true })
  isTempPass?: boolean;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  tokenExpiration?: number;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Enterprise, enterprise => enterprise.user)
  enterprises: Enterprise[];

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
