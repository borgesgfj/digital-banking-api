import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { TransferLogBuilder } from '../utils/builders/transfers-log-builder';
import { TransfersEntityBuilder } from '../utils/builders/transfers-entity-builders';
import { TransfersController } from './transfers.controller';
import { TrasnfersService } from './service/interfaces/transfers.service';

describe('TransfersController', () => {
  let transfersController: TransfersController;
  let transfersServiceMock: DeepMocked<TrasnfersService>;

  const transferLog = TransferLogBuilder.buildTransfersLog();
  const transfersDto = TransfersEntityBuilder.buildTransfers();

  beforeEach(() => {
    transfersServiceMock = createMock<TrasnfersService>();
    transfersController = new TransfersController(transfersServiceMock);
  });

  describe('transfer', () => {
    it('should post a transfer succesfully', async () => {
      transfersServiceMock.transfer.mockResolvedValueOnce(transferLog);

      expect(await transfersController.transfer(transfersDto)).toEqual(
        transferLog,
      );

      expect(transfersServiceMock.transfer).toBeCalledWith(transfersDto);
      expect(transfersServiceMock.transfer).toBeCalledTimes(1);
    });

    it('should fail if TransfersService.transfer() throw an exception', async () => {
      transfersServiceMock.transfer.mockRejectedValueOnce(new Error());

      expect(transfersController.transfer(transfersDto)).rejects.toThrowError(
        new Error(),
      );

      expect(transfersServiceMock.transfer).toBeCalledWith(transfersDto);
      expect(transfersServiceMock.transfer).toBeCalledTimes(1);
    });
  });
});
