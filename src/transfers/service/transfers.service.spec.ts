import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Accounts } from '../../accounts/entities/account.entity';
import { AccountsBuilder } from '../../utils/builders/accounts-builder';
import { GetAccountsService } from '../../accounts/service/interfaces/get-accounts.service';
import { IAccountsTransfersDao } from '../dao/interfaces/accounts-transfers.dao';
import { TransfersValidations } from '../service/interfaces/transfers-validations.service';
import { TransferLog } from '../interfaces/transfer-log.interface';
import { TransferLogBuilder } from '../../utils/builders/transfers-log-builder';
import { TransferOperationDto } from '../dto/transfers.dto';
import { TransfersEntityBuilder } from '../../utils/builders/transfers-entity-builders';
import { BadRequestException } from '@nestjs/common';
import { TrasnfersServiceImpl } from './transfers.service.impl';

describe('TransferService', () => {
  let transfersService: TrasnfersServiceImpl;

  let getAccountsServiceMock: DeepMocked<GetAccountsService>;

  let accountsTransfersDaoMock: DeepMocked<IAccountsTransfersDao>;

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
    getAccountsServiceMock = createMock<GetAccountsService>();
    accountsTransfersDaoMock = createMock<IAccountsTransfersDao>();
    transfersValidationsMock = createMock<TransfersValidations>();

    transfersService = new TrasnfersServiceImpl(
      getAccountsServiceMock,
      accountsTransfersDaoMock,
      transfersValidationsMock,
    );
  });

  describe('transfer', () => {
    it('should perform a transfer succesfully', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValue(account);

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

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(2);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(1);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(1);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(1);

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
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

    it('should throw a BadRequestException if sender or receiver documents are not registred', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new BadRequestException(
          'Document not registred. Please check this information and try again',
        ),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(0);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should throw a BadRequestException if transfers value execeed sender account available value', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
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

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should throw a BadRequestException if a transfer with the same sender, receiver and value was performed 2 minutes before', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValue(account);
      transfersValidationsMock.validateDuplicatedTransfer.mockRejectedValueOnce(
        new BadRequestException('Duplicated Transfers.'),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new BadRequestException('Duplicated Transfers.'),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );
    });

    it('should fail if getByDocumentOrDie throws exception', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockRejectedValueOnce(
        new Error(),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new Error(),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(0);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should fail if validateDuplicatedTransfer throws exception', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValue(account);
      transfersValidationsMock.validateDuplicatedTransfer.mockRejectedValueOnce(
        new Error(),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new Error(),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledWith(
        account.document,
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
      expect(transfersValidationsMock.validateValue).toBeCalledTimes(0);
      expect(
        transfersValidationsMock.validateDuplicatedTransfer,
      ).toBeCalledTimes(0);
      expect(accountsTransfersDaoMock.executeTransfer).toBeCalledTimes(0);
    });

    it('should fail if executeTransfer throws exception', async () => {
      getAccountsServiceMock.getByDocumentOrDie.mockResolvedValueOnce(account);
      accountsTransfersDaoMock.executeTransfer.mockRejectedValueOnce(
        new Error(),
      );

      expect(transfersService.transfer(transfersDto)).rejects.toThrow(
        new Error(),
      );

      expect(getAccountsServiceMock.getByDocumentOrDie).toBeCalledTimes(1);
    });
  });
});
