import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/accounts/entities/account.entity';
import { TransfersEntity } from 'src/transfers/entities/transfers.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'example',
      password: 'example',
      database: 'test',
      entities: [Accounts, TransfersEntity],
      synchronize: true,
    }),
  ],
})
export class OrmModule {}
