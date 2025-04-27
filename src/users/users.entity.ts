import { Routes } from '../routes/routes.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  dni: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  role: 'CLIENT' | 'EMPLOYEE' | 'ADMIN';

  @OneToOne(() => Routes)
  @JoinColumn()
  route: Routes;

  @Column({ nullable: true })
  routeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
