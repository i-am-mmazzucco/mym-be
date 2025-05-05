import { Routes } from '../routes/routes.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
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

  @OneToMany(() => Routes, (route) => route.employee)
  routes: Routes[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
