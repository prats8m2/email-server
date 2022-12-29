import {
  Column,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Client_Hist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: true })
  update: string;

  @Column({ nullable: true })
  action!: string;

  @Column({ default: 1 })
  version!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  clientID!: string;

  @UpdateDateColumn({ nullable: true })
  modifiedOn?: Date;

  @Column({ nullable: true })
  modifiedBy?: string;

  @Column({ nullable: true })
  oldData!: string;

  @Column({ nullable: true })
  newData!: string;
}
