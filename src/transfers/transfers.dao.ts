import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransfersEntity } from './entities/transfers.entity';
import { AccountTransfer } from './interfaces/transfer-save.interface';

@Injectable()
export class TransfersDao {
  constructor(
    @InjectRepository(TransfersEntity)
    private transfersRepository: Repository<TransfersEntity>,
  ) {}

  private readonly transfersHistory: AccountTransfer[] = [];
  private idTransfer = 0;

  async save(transferSave: TransfersEntity) {
    await this.transfersRepository.save(transferSave);
  }

  async getSimilarTransfers(
    senderDoc: string,
    receiverDoc: string,
    transferValue: number,
  ) {
    const similarTransfers = await this.transfersRepository.find({
      where: {
        senderDocument: senderDoc,
        receiverDocument: receiverDoc,
        value: transferValue,
      },
    });

    return similarTransfers;
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
