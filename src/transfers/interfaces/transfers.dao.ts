import { TransfersEntity } from '../entities/transfers.entity';

export interface TransfersDao {
  save(transferSave: TransfersEntity): Promise<void>;

  getSimilarTransfers(
    senderDoc: string,
    receiverDoc: string,
    transferValue: number,
  ): Promise<TransfersEntity[]>;

  getTransactionsHistory(document: string): Promise<TransfersEntity[]>;
}
