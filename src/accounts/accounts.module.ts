import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DITokens } from '../common/enums/DITokens';
import { AccountsController } from './accounts.controller';
import { AccountsDaoImpl } from './accounts.dao.impl';
import { AccountsServiceImpl } from './accounts.service.impl';
import { Accounts } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AccountsController],
  providers: [
    { provide: DITokens.AccountsService, useClass: AccountsServiceImpl },
    { provide: DITokens.AccountsDao, useClass: AccountsDaoImpl },
  ],
  exports: [
    { provide: DITokens.AccountsService, useClass: AccountsServiceImpl },
    { provide: DITokens.AccountsDao, useClass: AccountsDaoImpl },
  ],
})
export class AccountsModule {}
