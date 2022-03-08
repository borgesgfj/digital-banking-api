import { TransferOperationDto } from '../../dto/transfers.dto';
import { TransferLog } from '../../interfaces/transfer-log.interface';

export interface TrasnfersService {
  transfer(transferOperationDto: TransferOperationDto): Promise<TransferLog>;
}
