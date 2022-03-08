import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from '../src/accounts/accounts.controller';
import { CreateAccountDto } from '../src/accounts/dto/create-account.dto';
import { Accounts } from '../src/accounts/entities/account.entity';
import { IAccountsDao } from '../src/accounts/dao/interfaces/accounts.dao';
import { DITokens } from '../src/common/enums/DITokens';
import { InMemoryAccountsDao } from './in-memory-dao/accounts-stub.dao';
import { AccountsBuilder } from '../src/utils/builders/accounts-builder';
import { GetAccountsServiceImpl } from '../src/accounts/service/get-accounts.sevice.impl';
import { CreateAccountsServiceImpl } from '../src/accounts/service/create-accounts.service.impl';

describe('AccountsController (e2e)', () => {
  let app: INestApplication;
  let accountsDao: IAccountsDao;

  beforeEach(async () => {
    accountsDao = new InMemoryAccountsDao();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: DITokens.GetAccountsService,
          useClass: GetAccountsServiceImpl,
        },
        {
          provide: DITokens.CreateAccountsService,
          useClass: CreateAccountsServiceImpl,
        },
        { provide: DITokens.AccountsDao, useValue: accountsDao },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('create', () => {
    it('should create an account succesfully', async () => {
      const account: Accounts = AccountsBuilder.buildAccounts(
        'MARIE CURIE',
        '865.615.970-44',
        1,
      );

      const accountsDto: CreateAccountDto = AccountsBuilder.buildAccounts(
        'MARIE CURIE',
        '865.615.970-44',
      );
      return await request(app.getHttpServer())
        .post('/create-account')
        .send(<Accounts>accountsDto)
        .expect(201)
        .expect(account);
    });

    it('should return a Bad_Request when request body is not expected ', async () => {
      return await request(app.getHttpServer())
        .post('/create-account')
        .send(<Accounts>{})
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            '"name" is required,"document" is required,"availableValue" is required',
          error: 'Bad Request',
        });
    });

    it('should return a Bad_Request when account is already registred', async () => {
      const accountsDto: CreateAccountDto = AccountsBuilder.buildAccounts(
        'MARIE CURIE',
        '865.615.970-44',
      );
      await accountsDao.save(<Accounts>{ ...accountsDto });

      return await request(app.getHttpServer())
        .post('/create-account')
        .send(<Accounts>accountsDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Document already registred. Unable to create new account',
          error: 'Bad Request',
        });
    });
  });
  afterEach(async () => {
    await app.close();
  });
});
