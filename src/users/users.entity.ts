import { Routes } from '../routes/routes.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { randomPassword } from '../utils/password';

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

  @Column({ nullable: true, default: randomPassword() })
  password: string;

  @Column()
  address: string;

  @Column()
  role: 'CLIENT' | 'EMPLOYEE' | 'ADMIN';

  @OneToMany(() => Routes, (route) => route.user)
  routes: Routes[];
}
