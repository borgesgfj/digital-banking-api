import { Inject, Injectable } from '@nestjs/common';
import { DITokens } from 'src/common/enums/DITokens';
import { AccountsDao } from '../accounts/accounts.dao.impl';
import { Accounts } from '../accounts/entities/account.entity';
import { TransfersEntity } from './entities/transfers.entity';
import { AccountsTransfersDao } from './interfaces/accounts-transfers.dao';
import { TransferLog } from './interfaces/transfer-log.interface';
import { TransfersDaoImpl } from './transfers.dao.impl';

@Injectable()
export class AccountsTransfersDaoImpl implements AccountsTransfersDao {
  constructor(
    @Inject(DITokens.AccountsDao) private readonly accountsDao: AccountsDao,
    @Inject(DITokens.TransfersDao)
    private readonly transfersDao: TransfersDaoImpl,
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
