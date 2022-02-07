import { Injectable } from '@nestjs/common';
import { AccountsDao } from 'src/accounts/accounts.dao';
import { Account } from 'src/accounts/interfaces/account.interface';
import { TransferLog } from './interfaces/transfer-log.interface';
import { TransfersDao } from './transfers.dao';

@Injectable()
export class AccountsTransfersDao {
  constructor(
    private readonly accountsDao: AccountsDao,
    private readonly transfersDao: TransfersDao,
  ) {}

  executeTransfer(
    senderAcc: Account,
    receiverAcc: Account,
    transferValue: number,
    timeStamp: string,
  ): TransferLog {
    this.transfersDao.save({
      senderDocument: senderAcc.document,
      receiverDocument: receiverAcc.document,
      value: transferValue,
      dateTime: timeStamp,
    });
    this.accountsDao.updateValue(senderAcc.document, senderAcc.availableValue);
    this.accountsDao.updateValue(
      receiverAcc.document,
      receiverAcc.availableValue,
    );

    return {
      availableValue: senderAcc.availableValue,
      receiverDocument: receiverAcc.document,
      senderDocument: senderAcc.document,
      dateTime: timeStamp,
    };
  }
}
