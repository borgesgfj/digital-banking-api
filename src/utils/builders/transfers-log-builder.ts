import { TransferLog } from 'src/transfers/interfaces/transfer-log.interface';
import { HandleTime } from '../handle-date';

export class TransferLogBuilder {
  static buildTransfersLog(): TransferLog {
    return <TransferLog>{
      availableValue: 990,
      receiverDocument: '111.111.111-11',
      senderDocument: '865.615.970-44',
      dateTime: HandleTime.timeStamp(),
    };
  }
}
