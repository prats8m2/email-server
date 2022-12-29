import {
  Entity,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Table: Client
@Entity()
export class ClientConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  medraHost: string;

  @Column({ nullable: true })
  medraUsername: string;

  @Column({ nullable: true })
  medraPass: string;

  @Column({ nullable: true })
  medraDBName: string;

  @Column({ nullable: true })
  medraPort: number;

  @Column({ nullable: true })
  airflowENV: string;

  @Column({ nullable: true })
  awsAccessKey: string;

  @Column({ nullable: true })
  awsRegion: string;

  @Column({ nullable: true })
  awsSecretKey: string;

  @Column({ nullable: true })
  snowflakeAccount: string;

  @Column({ nullable: true })
  snowflakeUsername: string;

  @Column({ nullable: true })
  snowflakePassword: string;

  @Column({ nullable: true })
  snowflakeDatabase: string;

  @Column({ nullable: true })
  snowflakeRole: string;

  @Column({ nullable: true })
  snowflakeWarehouse: string;

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
