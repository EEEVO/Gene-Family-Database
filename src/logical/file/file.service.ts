import { Injectable } from '@nestjs/common';
import {
  ConfigService,
  IProteinObject,
} from '../../common/config/config.service';

@Injectable()
export class FileService {
  private readonly proteinObject: IProteinObject;
  constructor(private readonly configService: ConfigService) {}

  txt(): void {
    console.log('更新');
    this.configService.updataProteinObject();
  }
}
