import {
  Entity,
  Column,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  OneToMany,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from './site.entity';
import { ClientConfig } from './clientConfig.entity';
import { Role } from './role.entity';
import { Enterprise } from './enterprise.entity';
import { Banner } from './banner.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  clientID!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  zipcode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  contactMobile?: string;

  @ManyToMany(() => Site, site => site.clients)
  @JoinTable()
  sites: Site[];

  @OneToMany(() => Role, role => role.client)
  roles: Role[];

  @OneToOne(() => ClientConfig)
  @JoinColumn()
  config: ClientConfig;

  @OneToMany(() => Banner, banner => banner.client)
  banners: Banner[];

  @OneToMany(() => Enterprise, enterprise => enterprise.client)
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
