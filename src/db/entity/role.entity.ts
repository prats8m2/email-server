import {
  Entity,
  Column,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Site } from './site.entity';
import { User } from './user.entity';
import { PermissionsI } from '../../interface/role/permissions';
import { Folder } from './folder.entity';
// Table: Role
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name!: string;

  @Column('simple-json', { nullable: false, default: {} })
  permission!: PermissionsI;

  @Column({ default: false })
  isDefault!: boolean;

  @Column()
  accountName!: string;

  @Column({ nullable: true })
  adminUsername!: string;

  @Column({ nullable: true })
  adminPassword!: string;

  @ManyToOne(() => Client, client => client.roles)
  @JoinColumn()
  client?: Client;

  @ManyToOne(() => Site, site => site.roles)
  @JoinColumn()
  site?: Site;

  @ManyToMany(() => User, user => user.roles, {
    cascade: true,
  })
  users: User[];

  @ManyToMany(() => Folder, folder => folder.roles)
  @JoinTable()
  folders: Folder[];

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
