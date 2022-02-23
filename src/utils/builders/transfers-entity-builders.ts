import { TransfersEntity } from 'src/transfers/entities/transfers.entity';

export class TransfersEntityBuilder {
  static buildTransfers(id?: number, dateTime?: string): TransfersEntity {
    return <TransfersEntity>{
      senderDocument: '865.615.970-44',
      receiverDocument: '111.111.111-11',
      value: 10,
      id: id,
      dateTime: dateTime,
    };
  }
}
