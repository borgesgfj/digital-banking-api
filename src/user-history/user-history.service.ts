import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransfersDao } from 'src/transfers/transfers.dao';

@Injectable()
export class HistoryService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transfersDao: TransfersDao,
  ) {}
  getHistory(document: string) {
    this.accountsService.getByDocumentOrDie(document);
    return this.transfersDao.filterTranferHistoryBy(
      (transfers) =>
        transfers.senderDocument === document ||
        transfers.receiverDocument === document,
    );
  }
}
