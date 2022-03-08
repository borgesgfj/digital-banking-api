import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { TrasnfersServiceImpl } from './service/transfers.service.impl';
import { TransfersController } from './transfers.controller';
import { TransfersValidationsImpl } from './service/transfers-validation.service.impl';
import { TransfersEntity } from './entities/transfers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DITokens } from '../common/enums/DITokens';
import { TransfersDaoImpl } from './dao/transfers.dao.impl';
import { AccountsTransfersDaoImpl } from './dao/accounts-transfers.dao.impl';

@Module({
  imports: [AccountsModule, TypeOrmModule.forFeature([TransfersEntity])],
  controllers: [TransfersController],
  providers: [
    { provide: DITokens.TrasnfersService, useClass: TrasnfersServiceImpl },
    {
      provide: DITokens.AccountsTransfersDao,
      useClass: AccountsTransfersDaoImpl,
    },
    { provide: DITokens.TransfersDao, useClass: TransfersDaoImpl },
    {
      provide: DITokens.TransfersValidations,
      useClass: TransfersValidationsImpl,
    },
  ],
  exports: [{ provide: DITokens.TransfersDao, useClass: TransfersDaoImpl }],
})
export class TransfersModule {}
