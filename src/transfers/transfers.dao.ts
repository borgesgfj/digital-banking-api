import { Injectable } from '@nestjs/common';
import {
  TransferSaveInput,
  AccountTransfer,
} from './interfaces/transfer-save.interface';

@Injectable()
export class TransfersDao {
  private readonly transfersHistory: AccountTransfer[] = [];
  private idTransfer = 0;

  save(transferSave: TransferSaveInput) {
    this.idTransfer++;
    this.transfersHistory.push({
      id: this.idTransfer.toString(),
      ...transferSave,
    });
  }

  filterTranferHistoryBy(filterCb: FilterCallback): AccountTransfer[] {
    return this.transfersHistory.filter(filterCb);
  }
}

type FilterCallback = (
  value: AccountTransfer,
  index?: number,
  array?: AccountTransfer[],
) => boolean;
