import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DITokens } from '../src/common/enums/DITokens';
import { AccountsTransfersDaoImpl } from '../src/transfers/accounts-transfers.dao.impl';
import { ITransfersDao } from '../src/transfers/interfaces/transfers.dao';
import { TransfersController } from '../src/transfers/transfers.controller';
import { TrasnfersServiceImpl } from '../src/transfers/transfers.service.impl';
import { InMemoryTransfersDao } from './in-memory-dao/transfers-stub.dao';
import { Accounts } from '../src/accounts/entities/account.entity';
import { AccountsBuilder } from '../src/utils/builders/accounts-builder';
import { TransferOperationDto } from '../src/transfers/dto/transfers.dto';
import { TransfersEntityBuilder } from '../src/utils/builders/transfers-entity-builders';
import { IAccountsDao } from '../src/accounts/interfaces/accounts.dao';
import { InMemoryAccountsDao } from './in-memory-dao/accounts-stub.dao';
import { CreateAccountDto } from '../src/accounts/dto/create-account.dto';
import { TransferLog } from '../src/transfers/interfaces/transfer-log.interface';
import { TransferLogBuilder } from '../src/utils/builders/transfers-log-builder';
import { TransfersValidations } from '../src/transfers/transfers-validation';
import { HandleTime } from '../src/utils/handle-date';
import { AccountsServiceImpl } from '../src/accounts/accounts.service.impl';
import { IAccountsService } from '../src/accounts/interfaces/accounts.service';

describe('TransfersController (e2e)', () => {
  let app: INestApplication;
  let transfersDao: ITransfersDao;
  let accountsDao: IAccountsDao;
  let accountsService: IAccountsService;

  beforeEach(async () => {
    transfersDao = new InMemoryTransfersDao();
    accountsDao = new InMemoryAccountsDao();
    accountsService = new AccountsServiceImpl(accountsDao);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        { provide: DITokens.TrasnfersService, useClass: TrasnfersServiceImpl },
        {
          provide: DITokens.AccountsTransfersDao,
          useClass: AccountsTransfersDaoImpl,
        },
        { provide: DITokens.TransfersDao, useValue: transfersDao },
        { provide: DITokens.AccountsDao, useValue: accountsDao },
        { provide: DITokens.AccountsService, useValue: accountsService },
        TransfersValidations,
        HandleTime,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('transfer', () => {
    it('should perform a trasnfer succesfully', async () => {
      const senderAccDto: CreateAccountDto = AccountsBuilder.buildAccounts(
        'MARIE CURIE',
        '865.615.970-44',
      );
      const receiverAccDto: CreateAccountDto = AccountsBuilder.buildAccounts(
        'ALBERT EINSTEIN',
        '111.111.111-11',
      );
      const transferDto: TransferOperationDto =
        TransfersEntityBuilder.buildTransfers();
      const transferLog: TransferLog = TransferLogBuilder.buildTransfersLog();

      accountsDao.save(<Accounts>{ ...senderAccDto });
      accountsDao.save(<Accounts>{ ...receiverAccDto });

      return await request(app.getHttpServer())
        .post('/transfers')
        .send(transferDto)
        .expect(201)
        .expect(transferLog);
    });

    it('should throw a BAD_REQUEST exception if request body is not espected', async () => {
      return await request(app.getHttpServer())
        .post('/transfers')
        .send(<TransferOperationDto>{})
        .expect(400)
        .expect({
          statusCode: 400,
          message: '"senderDocument" is required',
          error: 'Bad Request',
        });
    });

    it('should throw a BAD_REQUEST exception if account is not registred', async () => {
      const receiverAccDto: CreateAccountDto = AccountsBuilder.buildAccounts(
        'ALBERT EINSTEIN',
        '111.111.111-11',
      );
      const transferDto: TransferOperationDto =
        TransfersEntityBuilder.buildTransfers();
      accountsDao.save(<Accounts>{ ...receiverAccDto });

      return await request(app.getHttpServer())
        .post('/transfers')
        .send(transferDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Document not registred. Please check this information and try again',
          error: 'Bad Request',
        });
    });
  });
  afterEach(async () => {
    await app.close();
  });
});
