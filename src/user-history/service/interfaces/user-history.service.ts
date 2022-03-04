import { TransfersEntity } from '../../../transfers/entities/transfers.entity';

export interface HistoryService {
  getHistory(document: string): Promise<TransfersEntity[]>;
}
