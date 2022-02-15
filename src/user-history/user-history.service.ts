import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransfersDao } from 'src/transfers/transfers.dao';

@Injectable()
export class HistoryService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transfersDao: TransfersDao,
  ) {}
  async getHistory(document: string) {
    await this.accountsService.getByDocumentOrDie(document);
    return await this.transfersDao.getTransactionsHistory(document);
  }
}
