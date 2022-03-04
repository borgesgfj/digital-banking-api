import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Accounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column()
  availableValue: number;
}
