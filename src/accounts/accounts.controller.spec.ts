import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AccountsController } from './accounts.controller';
import { AccountsBuilder } from '../utils/builders/accounts-builder';
import { Accounts } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateAccountsService } from './service/interfaces/create-accounts.service';
import { GetAccountsService } from './service/interfaces/get-accounts.service';

describe('AccountsController', () => {
  let accountsController: AccountsController;
  let createAccountsServiceMock: DeepMocked<CreateAccountsService>;
  let getAccountsServiceMock: DeepMocked<GetAccountsService>;

  const account: Accounts = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
    1,
  );

  const accountsDto: CreateAccountDto = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
  );

  beforeEach(() => {
    createAccountsServiceMock = createMock<CreateAccountsService>();
    getAccountsServiceMock = createMock<GetAccountsService>();
    accountsController = new AccountsController(
      getAccountsServiceMock,
      createAccountsServiceMock,
    );
  });

  describe('create', () => {
    it('should create an accont succesfully', async () => {
      createAccountsServiceMock.create.mockResolvedValueOnce(account);

      expect(await accountsController.create(accountsDto)).toEqual(account);

      expect(createAccountsServiceMock.create).toBeCalledWith(accountsDto);
      expect(createAccountsServiceMock.create).toBeCalledTimes(1);
    });

    it('should fail if AccountsService create() throw an exception ', async () => {
      createAccountsServiceMock.create.mockRejectedValueOnce(new Error());

      expect(accountsController.create(accountsDto)).rejects.toThrowError();

      expect(createAccountsServiceMock.create).toBeCalledWith(accountsDto);
      expect(createAccountsServiceMock.create).toBeCalledTimes(1);
    });

    it('should return undefined if undefined is passed to accountsService create() ', async () => {
      createAccountsServiceMock.create.mockResolvedValueOnce(undefined);
      const accountsDto = {
        name: 'Albert Einstein',
        document: '111.111.111-11',
        availableValue: 100.5,
      };

      expect(await accountsController.create(accountsDto)).toBeUndefined();
    });
  });
});
