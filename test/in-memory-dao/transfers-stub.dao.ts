import { TransfersEntity } from 'src/transfers/entities/transfers.entity';
import { ITransfersDao } from 'src/transfers/interfaces/transfers.dao';

export class InMemoryTransfersDao implements ITransfersDao {
  private readonly transfersHistory: TransfersEntity[] = [];
  private idTransfer = 0;

  async save(transferSave: TransfersEntity) {
    this.idTransfer++;
    await this.transfersHistory.push({
      ...transferSave,
      id: this.idTransfer,
    });
  }

  async getSimilarTransfers(
    senderDoc: string,
    receiverDoc: string,
    transferValue: number,
  ) {
    return await this.filterTranferHistoryBy(
      (transfer) =>
        transfer.senderDocument === senderDoc &&
        transfer.receiverDocument === receiverDoc &&
        transfer.value === transferValue,
    );
  }

  async getTransactionsHistory(document: string): Promise<TransfersEntity[]> {
    return await this.filterTranferHistoryBy(
      (transfer) =>
        transfer.senderDocument === document ||
        transfer.receiverDocument === document,
    );
  }

  filterTranferHistoryBy(filterCb: FilterCallback): TransfersEntity[] {
    return this.transfersHistory.filter(filterCb);
  }
}

type FilterCallback = (
  value: TransfersEntity,
  index?: number,
  array?: TransfersEntity[],
) => boolean;
