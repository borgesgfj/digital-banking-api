import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { TransfersEntityBuilder } from '../utils/builders/transfers-entity-builders';
import { HandleTime } from '../utils/handle-date';
import { TransactionsHistoryController } from './user-history.controller';
import { HistoryService } from './user-history.service';

describe('TransactionsHistoryController', () => {
  let historyController: TransactionsHistoryController;
  let historyServiceMock: DeepMocked<HistoryService>;

  const transfer = TransfersEntityBuilder.buildTransfers(
    1,
    HandleTime.timeStamp(),
  );

  beforeEach(() => {
    historyServiceMock = createMock<HistoryService>();
    historyController = new TransactionsHistoryController(historyServiceMock);
  });

  describe('getHistory', () => {
    it('should return a transactions history succesfully', async () => {
      historyServiceMock.getHistory.mockResolvedValueOnce([transfer]);

      expect(await historyController.getHistory('865.615.970-44')).toEqual([
        transfer,
      ]);

      expect(historyServiceMock.getHistory).toBeCalledTimes(1);
      expect(historyServiceMock.getHistory).toBeCalledWith('865.615.970-44');
    });

    it('should throw a BadRequestException if document is not registred', async () => {
      historyServiceMock.getHistory.mockRejectedValueOnce(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(historyController.getHistory('865.615.970-49')).rejects.toThrow(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(historyServiceMock.getHistory).toBeCalledTimes(1);
      expect(historyServiceMock.getHistory).toBeCalledWith('865.615.970-49');
    });

    it('should fail if HistoryService getHistory() throws error', async () => {
      historyServiceMock.getHistory.mockRejectedValueOnce(new Error());

      expect(historyController.getHistory('865.615.970-44')).rejects.toThrow(
        new Error(),
      );

      expect(historyServiceMock.getHistory).toBeCalledTimes(1);
      expect(historyServiceMock.getHistory).toBeCalledWith('865.615.970-44');
    });
  });
});
