import { Accounts } from 'src/accounts/entities/account.entity';
import { TransferLog } from './transfer-log.interface';

export interface AccountsTransfersDao {
  executeTransfer(
    senderAcc: Accounts,
    receiverAcc: Accounts,
    transferValue: number,
    timeStamp: string,
  ): Promise<TransferLog>;
}
