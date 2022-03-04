import { Injectable } from '@nestjs/common';
import { AccountsDao } from 'src/accounts/accounts.dao';
import { Accounts } from 'src/accounts/entities/account.entity';
import { TransfersEntity } from './entities/transfers.entity';
import { TransferLog } from './interfaces/transfer-log.interface';
import { TransfersDao } from './transfers.dao';

@Injectable()
export class AccountsTransfersDao {
  constructor(
    private readonly accountsDao: AccountsDao,
    private readonly transfersDao: TransfersDao,
  ) {}

  async executeTransfer(
    senderAcc: Accounts,
    receiverAcc: Accounts,
    transferValue: number,
    timeStamp: string,
  ): Promise<TransferLog> {
    await this.transfersDao.save(<TransfersEntity>{
      senderDocument: senderAcc.document,
      receiverDocument: receiverAcc.document,
      value: transferValue,
      dateTime: timeStamp,
    });

    await this.accountsDao.updateValue(senderAcc.id, senderAcc.availableValue);
    await this.accountsDao.updateValue(
      receiverAcc.id,
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
