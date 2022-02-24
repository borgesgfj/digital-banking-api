import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { TransferLogBuilder } from '../utils/builders/transfers-log-builder';
import { AccountsServiceImpl } from '../accounts/accounts.service.impl';
import { Accounts } from '../accounts/entities/account.entity';
import { AccountsBuilder } from '../utils/builders/accounts-builder';
import { AccountsTransfersDaoImpl } from './accounts-transfers.dao.impl';
import { TransferLog } from './interfaces/transfer-log.interface';
import { TransfersValidations } from './transfers-validation';
import { TrasnfersServiceImpl } from './transfers.service.impl';
import { TransferOperationDto } from './dto/transfers.dto';
import { TransfersEntityBuilder } from '../utils/builders/transfers-entity-builders';
import { BadRequestException } from '@nestjs/common';

describe('TransferService', () => {
  let transfersService: TrasnfersServiceImpl;

  let accountsServiceMock: DeepMocked<AccountsServiceImpl>;

  let accountsTransfersDaoMock: DeepMocked<AccountsTransfersDaoImpl>;

  let transfersValidationsMock: DeepMocked<TransfersValidations>;

  const transferTimeout = 2 * 60 * 1000;
  const account: Accounts = AccountsBuilder.buildAccounts(
    'MARIE CURIE',
    '865.615.970-44',
    1,
  );

  const transferLog: TransferLog = TransferLogBuilder.buildTransfersLog();

  const transfersDto: TransferOperationDto =
    TransfersEntityBuilder.buildTransfers();

  beforeEach(() => {
    accountsServiceMock = createMock<AccountsServiceImpl>();
    accountsTransfersDaoMock = createMock<AccountsTransfersDaoImpl>();
    transfersValidationsMock = createMock<TransfersValidations>();

    transfersService = new TrasnfersServiceImpl(
      accountsServiceMock,
      accountsTransfersDaoMock,
      transfersValidationsMock,
    );
  });

  // succesful case
  describe('transfer', () => {
    it('should perform a transfer succesfully', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValue(account);

      transfersValidationsMock.validateValue.mockReturnValueOnce(undefined);

      accountsTransfersDaoMock.executeTransfer.mockResolvedValueOnce(
        transferLog,
      );

      transfersValidationsMock.validateDuplicatedTransfer.mockReturnValueOnce(
        undefined,
      );

      expect(await transfersService.transfer(transfersDto)).toEqual(
        transferLog,
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(2);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(1);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(1);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(1);

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );
      expect(transfersValidationsMock.validateValue).toBeCalledWith(
        account.availableValue,
        transfersDto.value,
      );
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledWith(
        account.document,
        account.document,
        transfersDto.value,
        transferLog.dateTime,
        transferTimeout,
      );

      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledWith(
        {
          ...account,
          availableValue: account.availableValue - transfersDto.value,
        },
        {
          ...account,
          availableValue: account.availableValue + transfersDto.value,
        },
        transfersDto.value,
        transferLog.dateTime,
      );
    });

    // expected operation error

    it('should throw a BadRequestException if sender or receiver documents are not registred', async () => {
      accountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(0);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should throw a BadRequestException if transfers value execeed sender account available value', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      transfersValidationsMock.validateValue.mockImplementationOnce(() => {
        throw new BadRequestException(
          'Insuficient account founds. Transference can not be concluded.',
        );
      });

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new BadRequestException(
          'Insuficient account founds. Transference can not be concluded.',
        ),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should throw a BadRequestException if a transfer with the same sender, receiver and value was performed 2 minutes before', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValue(account);
      transfersValidationsMock.validateDuplicatedTransfer.mockRejectedValueOnce(
        new BadRequestException('Duplicated Transfers.'),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new BadRequestException('Duplicated Transfers.'),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );
    });

    // unexpected dependency error

    it('should fail if getByDocumentOrDie throws exception', async () => {
      accountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(new Error());

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new Error(),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(0);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should fail if validateDuplicatedTransfer throws exception', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValue(account);
      transfersValidationsMock.validateDuplicatedTransfer.mockRejectedValueOnce(
        new Error(),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new Error(),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(0);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should fail if executeTransfer throws exception', async () => {
      accountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      accountsTransfersDaoMock.executeTransfer.mockRejectedValueOnce(
        new Error(),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new Error(),
      );

      expect(accountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
    });
  });
});
