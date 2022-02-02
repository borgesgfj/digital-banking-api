import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransferOperationDto } from './dto/transfers.dto';
import { AccountsTransfersDao } from './accounts-transfers.dao';
import { ValidatorValue } from './validator-value';

@Injectable()
export class TrasnfersService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transfersDao: AccountsTransfersDao,
    private readonly validatorValue: ValidatorValue,
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

    const transferValue = transferOperationDto.value;

    this.validatorValue.validate(senderAcc.availableValue, transferValue);

    senderAcc.availableValue = senderAcc.availableValue - transferValue;

    receiverAcc.availableValue = receiverAcc.availableValue + transferValue;

    return this.transfersDao.executeTransfer(
      senderAcc,
      receiverAcc,
      transferValue,
    );
  }
}
