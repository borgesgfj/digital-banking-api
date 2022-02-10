import { Module } from '@nestjs/common';
import { OrmModule } from 'global_modules/typeORM.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';
import { HistoryModule } from './user-history/user-history.module';

@Module({
  imports: [AccountsModule, TransfersModule, HistoryModule, OrmModule],
})
export class AppModule {}
