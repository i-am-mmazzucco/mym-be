import { Users } from '../users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { Order } from '../orders/orders.entity';

@Entity()
export class Routes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  coordinates: Point;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.routes)
  employee: Users;

  @OneToOne(() => Order, (order) => order.route, { nullable: true })
  @JoinColumn()
  order: Order;
}
