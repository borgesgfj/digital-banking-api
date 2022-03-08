import { Controller, Get, Inject, Param } from '@nestjs/common';
import { DITokens } from '../common/enums/DITokens';
import { HistoryServiceImpl } from './service/user-history.service.impl';

@Controller('transactions-history')
export class TransactionsHistoryController {
  constructor(
    @Inject(DITokens.HistoryService)
    private readonly historyService: HistoryServiceImpl,
  ) {}

  @Get(':document')
  getHistory(@Param('document') document: string) {
    return this.historyService.getHistory(document);
  }
}
