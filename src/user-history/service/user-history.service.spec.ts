import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HandleTime } from '../../utils/handle-date';
import { TransfersEntityBuilder } from '../../utils/builders/transfers-entity-builders';
import { Accounts } from '../../accounts/entities/account.entity';
import { AccountsBuilder } from '../../utils/builders/accounts-builder';
import { BadRequestException } from '@nestjs/common';
import { GetAccountsService } from '../../accounts/service/interfaces/get-accounts.service';
import { ITransfersDao } from '../../transfers/dao/interfaces/transfers.dao';
import { HistoryServiceImpl } from './user-history.service.impl';

describe('HistoryService', () => {
  let historyService: HistoryServiceImpl;
  let getAccountsServiceMock: DeepMocked<GetAccountsService>;
  let transfersDaoMock: DeepMocked<ITransfersDao>;

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
    getAccountsServiceMock = createMock<GetAccountsService>();
    transfersDaoMock = createMock<ITransfersDao>();
    historyService = new HistoryServiceImpl(
      getAccountsServiceMock,
      transfersDaoMock,
    );
  });

  describe('getHistory', () => {
    it('should return a transaction history succesfully', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      transfersDaoMock.getTransactionsHistory.mockResolvedValueOnce([transfer]);

      expect(await historyService.getHistory('865.615.970-44')).toEqual([
        transfer,
      ]);

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersDaoMock.getTransactionsHistory).toBeCalledTimes(1);
      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-44',
      );
      expect(transfersDaoMock.getTransactionsHistory).toBeCalledWith(
        '865.615.970-44',
      );
    });

    it('should throw a BadRequestException if document is not registred', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(historyService.getHistory('865.615.970-49')).rejects.toThrow(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-49',
      );
    });

    it('should fail if getByDocumentOrDie throws error', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(
        new Error(),
      );

      expect(historyService.getHistory('865.615.970-44')).rejects.toThrow(
        new Error(),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-44',
      );
    });

    it('should fail if getTransactionsHistory throws error', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      transfersDaoMock.getTransactionsHistory.mockRejectedValueOnce(
        new Error(),
      );

      expect(historyService.getHistory('865.615.970-44')).rejects.toThrow(
        new Error(),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersDaoMock.getTransactionsHistory).toBeCalledTimes(0);
      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        '865.615.970-44',
      );
    });
  });
});
