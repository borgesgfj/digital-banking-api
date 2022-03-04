import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsServiceImpl } from '../src/accounts/accounts.service.impl';
import { IAccountsDao } from 'src/accounts/interfaces/accounts.dao';
import { IAccountsService } from '../src/accounts/interfaces/accounts.service';
import { DITokens } from '../src/common/enums/DITokens';
import { TransfersEntity } from '../src/transfers/entities/transfers.entity';
import { ITransfersDao } from '../src/transfers/interfaces/transfers.dao';
import { TransactionsHistoryController } from '../src/user-history/user-history.controller';
import { HistoryService } from '../src/user-history/user-history.service';
import { TransfersEntityBuilder } from '../src/utils/builders/transfers-entity-builders';
import { HandleTime } from '../src/utils/handle-date';
import { InMemoryAccountsDao } from './in-memory-dao/accounts-stub.dao';
import { InMemoryTransfersDao } from './in-memory-dao/transfers-stub.dao';
import { CreateAccountDto } from '../src/accounts/dto/create-account.dto';
import { AccountsBuilder } from '../src/utils/builders/accounts-builder';
import { Accounts } from '../src/accounts/entities/account.entity';

describe('TransactionsHistoryController (e2e)', () => {
  let app: INestApplication;
  let transfersDao: ITransfersDao;
  let accountsService: IAccountsService;
  let accountsDao: IAccountsDao;

  beforeEach(async () => {
    transfersDao = new InMemoryTransfersDao();
    accountsDao = new InMemoryAccountsDao();
    accountsService = new AccountsServiceImpl(accountsDao);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsHistoryController],
      providers: [
        { provide: DITokens.TransfersDao, useValue: transfersDao },
        { provide: DITokens.AccountsService, useValue: accountsService },
        HistoryService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('getHistory', () => {
    it('should return the user history succesfully', async () => {
      const senderAcc: CreateAccountDto = AccountsBuilder.buildAccounts(
        'MARIE CURIE',
        '865.615.970-44',
      );
      const transfer: TransfersEntity = TransfersEntityBuilder.buildTransfers(
        1,
        HandleTime.timeStamp(),
      );

      accountsDao.save(<Accounts>{ ...senderAcc });
      transfersDao.save(transfer);

      return await request(app.getHttpServer())
        .get('/transactions-history/865.615.970-44')
        .expect(200)
        .expect([transfer]);
    });

    // operational error
    it('should return a BAD_REQUEST if document is not registred', async () => {
      return await request(app.getHttpServer())
        .get('/transactions-history/999.999.999-99')
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Document not registred. Please check this information and try again',
          error: 'Bad Request',
        });
    });
  });
});
