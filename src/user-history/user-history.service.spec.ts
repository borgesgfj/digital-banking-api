import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HandleTime } from '../utils/handle-date';
import { AccountsServiceImpl } from '../accounts/accounts.service.impl';
import { TransfersDaoImpl } from '../transfers/transfers.dao.impl';
import { TransfersEntityBuilder } from '../utils/builders/transfers-entity-builders';
import { HistoryService } from './user-history.service';
import { Accounts } from '../accounts/entities/account.entity';
import { AccountsBuilder } from '../utils/builders/accounts-builder';
import { BadRequestException } from '@nestjs/common';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let accountsServiceMock: DeepMocked<AccountsServiceImpl>;
  let transfersDaoMock: DeepMocked<TransfersDaoImpl>;

  const transfer = TransfersEntityBuilder.buildTransfers(
    1,
    HandleTime.timeStamp(),
  );
  const account: Accounts = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
    1,
  );

  beforeEach(() => {
    accountsServiceMock = createMock<AccountsServiceImpl>();
    transfersDaoMock = createMock<TransfersDaoImpl>();
    historyService = new HistoryService(accountsServiceMock, transfersDaoMock);
  });

  describe('getHistory', () => {
    it('should return a transaction history succesfully', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      transfersDaoMock.getTransactionsHistory.mockResolvedValueOnce([transfer]);

      expect(await historyService.getHistory('865.615.970-44')).toEqual([
        transfer,
      ]);

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersDaoMock.getTransactionsHistory).toBeCalledTimes(1);
      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-44',
      );
      expect(transfersDaoMock.getTransactionsHistory).toBeCalledWith(
        '865.615.970-44',
      );
    });

    it('should throw a BadRequestException if document is not registred', async () => {
      accountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(historyService.getHistory('865.615.970-49')).rejects.toThrow(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-49',
      );
    });

    it('should fail if getByDocumentOrDie throws error', async () => {
      accountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(new Error());

      expect(historyService.getHistory('865.615.970-44')).rejects.toThrow(
        new Error(),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-44',
      );
    });

    it('should fail if getTransactionsHistory throws error', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      transfersDaoMock.getTransactionsHistory.mockRejectedValueOnce(
        new Error(),
      );

      expect(historyService.getHistory('865.615.970-44')).rejects.toThrow(
        new Error(),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersDaoMock.getTransactionsHistory).toBeCalledTimes(0);
      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-44',
      );
    });
  });
});
