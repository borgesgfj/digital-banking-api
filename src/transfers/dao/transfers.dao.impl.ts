import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransfersEntity } from '../entities/transfers.entity';
import { ITransfersDao } from './interfaces/transfers.dao';

@Injectable()
export class TransfersDaoImpl implements ITransfersDao {
  constructor(
    @InjectRepository(TransfersEntity)
    private transfersRepository: Repository<TransfersEntity>,
  ) {}

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

  async getTransactionsHistory(document: string): Promise<TransfersEntity[]> {
    return await this.transfersRepository.find({
      where: [{ receiverDocument: document }, { senderDocument: document }],
    });
  }
}
