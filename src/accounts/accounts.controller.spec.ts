import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsBuilder } from '../utils/builders/accounts-builder';
import { Accounts } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountsController', () => {
  let accountsController: AccountsController;
  let accountsServiceMock: DeepMocked<AccountsService>;

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
    accountsServiceMock = createMock<AccountsService>();
    accountsController = new AccountsController(accountsServiceMock);
  });

  describe('create', () => {
    it('should create an accont succesfully', async () => {
      accountsServiceMock.create.mockResolvedValueOnce(account);

      expect(await accountsController.create(accountsDto)).toEqual(account);

      expect(accountsServiceMock.create).toBeCalledWith(accountsDto);
      expect(accountsServiceMock.create).toBeCalledTimes(1);
    });

    it('should fail if AccountsService create() throw an exception ', async () => {
      accountsServiceMock.create.mockRejectedValueOnce(new Error());

      expect(accountsController.create(accountsDto)).rejects.toThrowError();

      expect(accountsServiceMock.create).toBeCalledWith(accountsDto);
      expect(accountsServiceMock.create).toBeCalledTimes(1);
    });

    it('should return undefined if undefined is passed to accountsService create() ', async () => {
      accountsServiceMock.create.mockResolvedValueOnce(undefined);
      const accountsDto = {
        name: 'Albert Einstein',
        document: '111.111.111-11',
        availableValue: 100.5,
      };

      expect(await accountsController.create(accountsDto)).toBeUndefined();
    });
  });
});
