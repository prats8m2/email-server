import {
  Column,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Site_Hist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: true })
  update: string;

  @Column()
  name!: string;

  @Column({ default: 1 })
  version!: number;

  @Column({ nullable: true })
  action!: string;

  @UpdateDateColumn({ nullable: true })
  modifiedOn?: Date;

  @Column({ nullable: true })
  modifiedBy?: string;

  @Column({ nullable: true })
  oldData!: string;

  @Column({ nullable: true })
  newData!: string;
}
