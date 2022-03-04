import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TrasnfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { AccountsTransfersDao } from './accounts-transfers.dao';
import { TransfersDao } from './transfers.dao';
import { TransfersValidations } from './transfers-validation';
import { HandleTime } from '../utils/handle-date';
import { TransfersEntity } from './entities/transfers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AccountsModule, TypeOrmModule.forFeature([TransfersEntity])],
  controllers: [TransfersController],
  providers: [
    TrasnfersService,
    AccountsTransfersDao,
    TransfersDao,
    TransfersValidations,
    HandleTime,
  ],
  exports: [TransfersDao],
})
export class TransfersModule {}
