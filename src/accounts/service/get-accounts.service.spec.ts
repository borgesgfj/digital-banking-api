import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Accounts } from '../entities/account.entity';
import { AccountsBuilder } from '../../utils/builders/accounts-builder';
import { BadRequestException } from '@nestjs/common';
import { GetAccountsServiceImpl } from '../service/get-accounts.sevice.impl';
import { GetAccountsService } from '../service/interfaces/get-accounts.service';
import { IAccountsDao } from '../dao/interfaces/accounts.dao';

describe('GetAccountsServiceImpl', () => {
  let getAccountsService: GetAccountsService;
  let accountsDaoMock: DeepMocked<IAccountsDao>;
  const account: Accounts = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
    1,
  );

  beforeEach(() => {
    accountsDaoMock = createMock<IAccountsDao>();
    getAccountsService = new GetAccountsServiceImpl(accountsDaoMock);
  });

  describe('getByDocumentOrDie', () => {
    it('should return an account succesfully', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(account);

      expect(
        await getAccountsService.getByDocumentOrDie('865.615.970-44'),
      ).toEqual(account);
      expect(accountsDaoMock.getByDocument).toBeCalledWith('865.615.970-44');
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
    });

    it('should fail if getByDocument throw an exception', () => {
      accountsDaoMock.getByDocument.mockRejectedValueOnce(new Error());

      expect(
        getAccountsService.getByDocumentOrDie(account.document),
      ).rejects.toThrowError(new Error());

      expect(accountsDaoMock.getByDocument).toBeCalledWith('865.615.970-44');
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if account does not exist', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(undefined);

      expect(
        getAccountsService.getByDocumentOrDie('865.615.970-44'),
      ).rejects.toThrow(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(accountsDaoMock.getByDocument).toBeCalledWith('865.615.970-44');
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
    });
  });
});
