import { Inject, Injectable } from '@nestjs/common';
import { DITokens } from '../common/enums/DITokens';
import { AccountsServiceImpl } from '../accounts/accounts.service.impl';
import { TransfersDaoImpl } from '../transfers/transfers.dao.impl';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(DITokens.AccountsService)
    private readonly accountsService: AccountsServiceImpl,
    @Inject(DITokens.TransfersDao)
    private readonly transfersDao: TransfersDaoImpl,
  ) {}
  async getHistory(document: string) {
    await this.accountsService.getByDocumentOrDie(document);
    return await this.transfersDao.getTransactionsHistory(document);
  }
}
