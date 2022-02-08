import { Controller, Get, Param } from '@nestjs/common';
import { HistoryService } from './user-history.service';

@Controller('transactions-history')
export class TransactionsHistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':document')
  getHistory(@Param('document') document: string) {
    return this.historyService.getHistory(document);
  }
}
