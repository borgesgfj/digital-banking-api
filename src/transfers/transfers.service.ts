import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransferOperationDto } from './dto/transfers.dto';
import { AccountsTransfersDao } from './accounts-transfers.dao';
import { TransfersValidations } from './transfers-validation';
import { HandleRequestTime } from './transfer-date';

const TRANSFER_TIMEOUT = 2 * 60 * 1000; // 2MIN

@Injectable()
export class TrasnfersService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transfersDao: AccountsTransfersDao,
    private readonly transfersValidations: TransfersValidations,
  ) {}
  transfer(transferOperationDto: TransferOperationDto) {
    const senderAcc = {
      ...this.accountsService.getByDocumentOrDie(
        transferOperationDto.senderDocument,
      ),
    };

    const receiverAcc = {
      ...this.accountsService.getByDocumentOrDie(
        transferOperationDto.receiverDocument,
      ),
    };
    const timeStamp = HandleRequestTime.timeStamp();

    const transferValue = transferOperationDto.value;

    this.transfersValidations.validateValue(
      senderAcc.availableValue,
      transferValue,
    );

    this.transfersValidations.validateDuplicatedTransfer(
      senderAcc,
      receiverAcc,
      transferValue,
      timeStamp,
      TRANSFER_TIMEOUT,
    );

    senderAcc.availableValue = senderAcc.availableValue - transferValue;

    receiverAcc.availableValue = receiverAcc.availableValue + transferValue;

    return this.transfersDao.executeTransfer(
      senderAcc,
      receiverAcc,
      transferValue,
      timeStamp,
    );
  }
}
