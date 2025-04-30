import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Item } from '../items/items.entity';
import { Users } from '../users/users.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  @JoinColumn()
  client: Users;

  @ManyToOne(() => Users)
  @JoinColumn()
  employeeAssigned: Users;

  @Column()
  address: string;

  @Column({ nullable: true })
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

  @Column({ default: 0 })
  totalAmountPaid: number;

  @OneToMany(() => Item, (item) => item.order, { cascade: true })
  items: Item[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
