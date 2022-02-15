import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransfersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderDocument: string;

  @Column()
  receiverDocument: string;

  @Column()
  value: number;

  @Column()
  dateTime: string;
}
