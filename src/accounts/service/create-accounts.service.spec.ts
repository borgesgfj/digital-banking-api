import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Accounts } from '../entities/account.entity';
import { AccountsBuilder } from '../../utils/builders/accounts-builder';
import { CreateAccountDto } from '../dto/create-account.dto';
import { BadRequestException } from '@nestjs/common';
import { IAccountsDao } from '../dao/interfaces/accounts.dao';
import { CreateAccountsService } from './interfaces/create-accounts.service';
import { CreateAccountsServiceImpl } from './create-accounts.service.impl';

describe('CreateAccountsServiceImpl', () => {
  let createAccountsService: CreateAccountsService;
  let accountsDaoMock: DeepMocked<IAccountsDao>;
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
    accountsDaoMock = createMock<IAccountsDao>();
    createAccountsService = new CreateAccountsServiceImpl(accountsDaoMock);
  });

  describe('create', () => {
    it('should return an account succesfully', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(undefined);
      accountsDaoMock.save.mockResolvedValueOnce(account);

      expect(await createAccountsService.create(<Accounts>accountDto)).toEqual(
        account,
      );
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.save).toBeCalledTimes(1);
      expect(accountsDaoMock.getByDocument).toBeCalledWith(account.document);
      expect(accountsDaoMock.save).toBeCalledWith(accountDto);
    });

    it('should fail if getByDocument throw an exception', async () => {
      accountsDaoMock.getByDocument.mockRejectedValueOnce(new Error());

      expect(
        createAccountsService.create(<Accounts>accountDto),
      ).rejects.toThrowError(new Error());

      expect(accountsDaoMock.getByDocument).toBeCalledWith(accountDto.document);
      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.save).toBeCalledTimes(0);
    });

    it('should throw a BadRequestException if accounts already exist', async () => {
      accountsDaoMock.getByDocument.mockResolvedValueOnce(account);

      expect(
        createAccountsService.create(<Accounts>accountDto),
      ).rejects.toThrow(
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

      expect(
        createAccountsService.create(<Accounts>accountDto),
      ).rejects.toThrowError(new Error());

      expect(accountsDaoMock.getByDocument).toBeCalledTimes(1);
      expect(accountsDaoMock.getByDocument).toBeCalledWith(accountDto.document);
      expect(accountsDaoMock.save).toBeCalledTimes(0);
    });
  });
});
