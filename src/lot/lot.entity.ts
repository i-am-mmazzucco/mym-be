import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', generated: 'increment' })
  lotNumber: number;

  @Column()
  unitOfMeasure: 'kg' | 'g' | 'ml' | 'l';

  @Column()
  quantity: number;

  @Column({ type: 'date' })
  manufactureDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
