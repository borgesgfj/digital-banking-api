import { Inject, Injectable } from '@nestjs/common';
import { IAccountsDao } from 'src/accounts/interfaces/accounts.dao';
import { DITokens } from '../common/enums/DITokens';
import { Accounts } from '../accounts/entities/account.entity';
import { TransfersEntity } from './entities/transfers.entity';
import { IAccountsTransfersDao } from './interfaces/accounts-transfers.dao';
import { TransferLog } from './interfaces/transfer-log.interface';
import { ITransfersDao } from './interfaces/transfers.dao';

@Injectable()
export class AccountsTransfersDaoImpl implements IAccountsTransfersDao {
  constructor(
    @Inject(DITokens.AccountsDao) private readonly accountsDao: IAccountsDao,
    @Inject(DITokens.TransfersDao)
    private readonly transfersDao: ITransfersDao,
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
