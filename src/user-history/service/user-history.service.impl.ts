import { Inject, Injectable } from '@nestjs/common';
import { ITransfersDao } from '../../transfers/dao/interfaces/transfers.dao';
import { GetAccountsService } from '../../accounts/service/interfaces/get-accounts.service';
import { DITokens } from '../../common/enums/DITokens';
import { HistoryService } from './interfaces/user-history.service';

@Injectable()
export class HistoryServiceImpl implements HistoryService {
  constructor(
    @Inject(DITokens.GetAccountsService)
    private readonly getAccountsService: GetAccountsService,
    @Inject(DITokens.TransfersDao)
    private readonly transfersDao: ITransfersDao,
  ) {}
  async getHistory(document: string) {
    await this.getAccountsService.getByDocumentOrDie(document);
    return await this.transfersDao.getTransactionsHistory(document);
  }
}
