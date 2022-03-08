import { Inject, Injectable } from '@nestjs/common';
import { TransferOperationDto } from '../dto/transfers.dto';
import { HandleTime } from '../../utils/handle-date';
import { DITokens } from '../../common/enums/DITokens';
import { TrasnfersService } from './interfaces/transfers.service';
import { IAccountsTransfersDao } from '../dao/interfaces/accounts-transfers.dao';
import { GetAccountsService } from '../../accounts/service/interfaces/get-accounts.service';
import { TransfersValidations } from './interfaces/transfers-validations.service';

const TRANSFER_TIMEOUT = 2 * 60 * 1000; // 2MIN

@Injectable()
export class TrasnfersServiceImpl implements TrasnfersService {
  constructor(
    @Inject(DITokens.GetAccountsService)
    private readonly getAccountsService: GetAccountsService,
    @Inject(DITokens.AccountsTransfersDao)
    private readonly accountsTransfersDao: IAccountsTransfersDao,

    @Inject(DITokens.TransfersValidations)
    private readonly transfersValidations: TransfersValidations,
  ) {}
  async transfer(transferOperationDto: TransferOperationDto) {
    const senderAcc = {
      ...(await this.getAccountsService.getByDocumentOrDie(
        transferOperationDto.senderDocument,
      )),
    };

    const receiverAcc = {
      ...(await this.getAccountsService.getByDocumentOrDie(
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
