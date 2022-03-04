import { BadRequestException, Injectable } from '@nestjs/common';
import { HandleTime } from '../utils/handle-date';
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

  async validateDuplicatedTransfer(
    senderDoc: string,
    receiverDoc: string,
    transferValue: number,
    timeStamp: string,
    transferTimeOut: number,
  ) {
    const similarTransfers = [
      ...(await this.transfersDao.getSimilarTransfers(
        senderDoc,
        receiverDoc,
        transferValue,
      )),
    ];

    const duplicatedTransfers = similarTransfers.filter(
      (transfer) =>
        HandleTime.dateDifference(timeStamp, transfer.dateTime) <=
        transferTimeOut,
    );

    if (duplicatedTransfers.length > 0) {
      const lastTransferTime = duplicatedTransfers[0].dateTime;
      const deltaTime = HandleTime.dateDifference(timeStamp, lastTransferTime);
      const awaitTime = (transferTimeOut - deltaTime) / 1000;
      throw new BadRequestException(
        `Duplicated Transfer. Wait ${awaitTime} seconds and try again.`,
      );
    }
  }
}
