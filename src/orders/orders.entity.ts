import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Item } from '../items/items.entity';
import { Users } from '../users/users.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn()
  client: Users;

  @OneToOne(() => Users)
  @JoinColumn()
  employeeAssigned: Users;

  @Column()
  address: string;

  @Column()
  dateDelivery: Date;

  @Column()
  statusDelivery: string;

  @Column()
  typePayment: string;

  @Column()
  statusPayment: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column()
  totalAmount: number;

  @OneToMany(() => Item, (item) => item.order, { cascade: true })
  items: Item[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
