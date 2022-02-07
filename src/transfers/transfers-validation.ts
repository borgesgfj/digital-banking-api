import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from 'src/accounts/interfaces/account.interface';
import { HandleRequestTime } from './transfer-date';
import { TransfersDao } from './transfers.dao';

@Injectable()
export class TransfersValidations {
  constructor(private readonly transfersDao: TransfersDao) {}

  validateValue(availableValue: number, transferValue: number) {
    if (availableValue < transferValue) {
      throw new BadRequestException(
        'Insuficient account founds. Transferece can not be concluded.',
      );
    }
  }

  validateDuplicatedTransfer(
    senderAcc: Account,
    receiverAcc: Account,
    transferValue: number,
    timeStamp: string,
    transferTimeOut: number,
  ) {
    const duplicatedTransfers = this.transfersDao.filterTranferHistoryBy(
      (transfer) =>
        transfer.senderDocument === senderAcc.document &&
        transfer.receiverDocument === receiverAcc.document &&
        transfer.value === transferValue &&
        HandleRequestTime.dateDifference(timeStamp, transfer.dateTime) <=
          transferTimeOut,
    );
    if (duplicatedTransfers.length > 0) {
      const lastTransferTime = duplicatedTransfers[0].dateTime;
      const deltaTime = HandleRequestTime.dateDifference(
        timeStamp,
        lastTransferTime,
      );
      const awaitTime = (transferTimeOut - deltaTime) / 1000;
      throw new BadRequestException(
        `Duplicated Transfer. Wait ${awaitTime} seconds and try again.`,
      );
    }
  }
}
