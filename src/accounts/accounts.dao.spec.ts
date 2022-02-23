import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AccountsBuilder } from '../utils/builders/accounts-builder';
import { Repository } from 'typeorm';
import { AccountsDao } from './accounts.dao';
import { Accounts } from './entities/account.entity';

describe('AccountsDao', () => {
  let accountsDao: AccountsDao;
  let accountsRepositoryMock: DeepMocked<Repository<Accounts>>;

  const account: Accounts = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
    1,
  );

  beforeEach(() => {
    accountsRepositoryMock = createMock<Repository<Accounts>>();
    accountsDao = new AccountsDao(accountsRepositoryMock);
  });

  describe('getByDocument', () => {
    it('should return an account succesfully', async () => {
      accountsRepositoryMock.findOne.mockResolvedValueOnce(account);

      expect(await accountsDao.getByDocument('865.615.970-44')).toEqual(
        account,
      );

      expect(accountsRepositoryMock.findOne).toBeCalledWith({
        document: account.document,
      });
      expect(accountsRepositoryMock.findOne).toBeCalledTimes(1);
    });

    it('should return undefined if account does not exist', async () => {
      accountsRepositoryMock.findOne.mockResolvedValueOnce(undefined);

      expect(await accountsDao.getByDocument('865.615.970-48')).toBeUndefined();

      expect(accountsRepositoryMock.findOne).toBeCalledTimes(1);
      expect(accountsRepositoryMock.findOne).toBeCalledWith({
        document: '865.615.970-48',
      });
    });

    it('should fail if findOne throw an exception', async () => {
      accountsRepositoryMock.findOne.mockRejectedValueOnce(new Error());

      expect(accountsDao.getByDocument('865.615.970-44')).rejects.toThrow(
        new Error(),
      );

      expect(accountsRepositoryMock.findOne).toBeCalledTimes(1);
      expect(accountsRepositoryMock.findOne).toBeCalledWith({
        document: '865.615.970-44',
      });
    });
  });

  describe('save', () => {
    it('should save an account sucesfully', async () => {
      accountsRepositoryMock.save.mockResolvedValueOnce(account);
      accountsRepositoryMock.findOne.mockResolvedValueOnce(account);

      expect(await accountsDao.save(account)).toEqual(account);
      expect(accountsRepositoryMock.save).toBeCalledTimes(1);
      expect(accountsRepositoryMock.save).toBeCalledWith(account);
    });

    it('should fail if Repository save throw an exception', async () => {
      accountsRepositoryMock.save.mockRejectedValueOnce(new Error());

      expect(accountsDao.save(account)).rejects.toThrow(new Error());
      expect(accountsRepositoryMock.save).toBeCalledTimes(1);
      expect(accountsRepositoryMock.save).toBeCalledWith(account);
    });

    it('should fail if getByDocument throw an exception', async () => {
      accountsRepositoryMock.findOne.mockRejectedValueOnce(new Error());

      expect(accountsDao.save(account)).rejects.toThrow(new Error());
      expect(accountsRepositoryMock.save).toBeCalledTimes(1);
      expect(accountsRepositoryMock.save).toBeCalledWith(account);
    });
  });
});
