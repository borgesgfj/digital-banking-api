import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';
import { HistoryModule } from './user-history/user-history.module';

@Module({
  imports: [AccountsModule, TransfersModule, HistoryModule],
})
export class AppModule {}
