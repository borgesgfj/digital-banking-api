import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DITokens } from '../common/enums/DITokens';
import { AccountsController } from './accounts.controller';
import { AccountsDaoImpl } from './dao/accounts.dao.impl';
import { CreateAccountsServiceImpl } from './service/create-accounts.service.impl';
import { Accounts } from './entities/account.entity';
import { GetAccountsServiceImpl } from './service/get-accounts.sevice.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AccountsController],
  providers: [
    { provide: DITokens.GetAccountsService, useClass: GetAccountsServiceImpl },
    {
      provide: DITokens.CreateAccountsService,
      useClass: CreateAccountsServiceImpl,
    },
    { provide: DITokens.AccountsDao, useClass: AccountsDaoImpl },
  ],
  exports: [
    { provide: DITokens.GetAccountsService, useClass: GetAccountsServiceImpl },
    { provide: DITokens.AccountsDao, useClass: AccountsDaoImpl },
  ],
})
export class AccountsModule {}
