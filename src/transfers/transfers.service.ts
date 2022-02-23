import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { TransferOperationDto } from './dto/transfers.dto';
import { AccountsTransfersDao } from './accounts-transfers.dao';
import { TransfersValidations } from './transfers-validation';
import { HandleTime } from '../utils/handle-date';

const TRANSFER_TIMEOUT = 2 * 60 * 1000; // 2MIN

@Injectable()
export class TrasnfersService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly accountsTransfersDao: AccountsTransfersDao,
    private readonly transfersValidations: TransfersValidations,
  ) {}
  async transfer(transferOperationDto: TransferOperationDto) {
    const senderAcc = {
      ...(await this.accountsService.getByDocumentOrDie(
        transferOperationDto.senderDocument,
      )),
    };

    const receiverAcc = {
      ...(await this.accountsService.getByDocumentOrDie(
        transferOperationDto.receiverDocument,
      )),
    };

    const currentTimeStamp = HandleTime.timeStamp();

    const transferValue = transferOperationDto.value;

    this.transfersValidations.validateValue(
      senderAcc.availableValue,
      transferValue,
    );

    await this.transfersValidations.validateDuplicatedTransfer(
      senderAcc.document,
      receiverAcc.document,
      transferValue,
      currentTimeStamp,
      TRANSFER_TIMEOUT,
    );
    senderAcc.availableValue = senderAcc.availableValue - transferValue;

    receiverAcc.availableValue = receiverAcc.availableValue + transferValue;

    return this.accountsTransfersDao.executeTransfer(
      senderAcc,
      receiverAcc,
      transferValue,
      currentTimeStamp,
    );
  }
}
