import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsDao } from 'src/accounts/accounts.dao';
import { Account } from 'src/accounts/interfaces/account.interface';
import { TransferLog } from './interfaces/transfer-log.interface';
import { HandleRequestTime } from './transfer-date';
import { TransfersDao } from './transfers.dao';

const TRANSFER_TIMEOUT = 2 * 60 * 1000; // 2MIN

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
  ): TransferLog {
    const timeStamp = HandleRequestTime.timeStamp();
    const duplicatedTransfers = this.transfersDao.filterTranferHistoryBy(
      (transfer) =>
        transfer.senderDocument === senderAcc.document &&
        transfer.receiverDocument === receiverAcc.document &&
        transfer.value === transferValue &&
        HandleRequestTime.dateDifference(timeStamp, transfer.dateTime) <=
          TRANSFER_TIMEOUT,
    );

    if (duplicatedTransfers.length > 0) {
      const lastTransferTime = duplicatedTransfers[0].dateTime;
      const deltaTime = HandleRequestTime.dateDifference(
        timeStamp,
        lastTransferTime,
      );
      const awaitTime = (TRANSFER_TIMEOUT - deltaTime) / 1000;
      throw new BadRequestException(
        `Duplicated Transfer. Wait ${awaitTime} seconds and try again.`,
      );
    }

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
