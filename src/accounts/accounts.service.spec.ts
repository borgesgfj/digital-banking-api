import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AccountsDao } from './accounts.dao';
import { AccountsService } from './accounts.service';
import { Accounts } from './entities/account.entity';
import { AccountsBuilder } from '../utils/builders/accounts-builder';
import { CreateAccountDto } from './dto/create-account.dto';
import { BadRequestException } from '@nestjs/common';

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let accountsDaoMock: DeepMocked<AccountsDao>;
  const account: Accounts = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
    1,
  );
  const accountDto: CreateAccountDto = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
  );

  beforeEach(() => {
    accountsDaoMock = createMock<AccountsDao>();
    accountsService = new AccountsService(accountsDaoMock);
  });

  describe('create', () => {
    it('should return an account succesfully', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(undefined);
      accountsDaoMock.save.mockResolvedValueOnce(account);

      expect(await accountsService.create(<Accounts>accountDto)).toEqual(
        account,
      );
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.save).toBeCalledTimes(1);
      expect(accountsDaoMock.getByDocument).toBeCalledWith(account.document);
      expect(accountsDaoMock.save).toBeCalledWith(accountDto);
    });

    it('should fail if getByDocument throw an exception', async () => {
      accountsDaoMock.getByDocument.mockRejectedValueOnce(new Error());

      expect(accountsService.create(<Accounts>accountDto)).rejects.toThrowError(
        new Error(),
      );

      expect(accountsDaoMock.getByDocument).toBeCalledWith(accountDto.document);
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.save).toBeCalledTimes(0);
    });

    it('should throw a BadRequestException if accounts already exist', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(account);

      expect(accountsService.create(<Accounts>accountDto)).rejects.toThrow(
        new BadRequestException(
          'Document already registred. Unable to create new account',
        ),
      );

      expect(accountsDaoMock.getByDocument).toBeCalledWith(accountDto.document);
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.save).toBeCalledTimes(0);
    });

    it('should fail if save throws an exception', async () => {
      accountsDaoMock.save.mockRejectedValueOnce(new Error());
      accountsDaoMock.getByDocument.mockResolvedValueOnce(undefined);

      expect(accountsService.create(<Accounts>accountDto)).rejects.toThrowError(
        new Error(),
      );

      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.getByDocument).toBeCalledWith(accountDto.document);
      expect(accountsDaoMock.save).toBeCalledTimes(0);
    });
  });

  describe('getByDocumentOrDie', () => {
    it('should return an account succesfully', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(account);

      expect(
        await accountsService.getByDocumentOrDie('865.615.970-44'),
      ).toEqual(account);
      expect(accountsDaoMock.getByDocument).toBeCalledWith('865.615.970-44');
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
    });

    it('should fail if getByDocument throw an exception', () => {
      accountsDaoMock.getByDocument.mockRejectedValueOnce(new Error());

      expect(
        accountsService.getByDocumentOrDie(account.document),
      ).rejects.toThrowError(new Error());

      expect(accountsDaoMock.getByDocument).toBeCalledWith('865.615.970-44');
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if account does not exist', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(undefined);

      expect(
        accountsService.getByDocumentOrDie('865.615.970-44'),
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
