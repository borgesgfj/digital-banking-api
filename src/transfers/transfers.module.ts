import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { TrasnfersServiceImpl } from './transfers.service.impl';
import { TransfersController } from './transfers.controller';
import { AccountsTransfersDaoImpl } from './accounts-transfers.dao.impl';
import { TransfersDaoImpl } from './transfers.dao.impl';
import { TransfersValidations } from './transfers-validation';
import { HandleTime } from '../utils/handle-date';
import { TransfersEntity } from './entities/transfers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DITokens } from '../common/enums/DITokens';

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
    TransfersValidations,
    HandleTime,
  ],
  exports: [{ provide: DITokens.TransfersDao, useClass: TransfersDaoImpl }],
})
export class TransfersModule {}
