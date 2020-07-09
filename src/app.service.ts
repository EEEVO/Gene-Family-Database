import { Injectable } from '@nestjs/common';
import { ConfigService, IProteinObject } from './common/config/config.service';

@Injectable()
export class AppService {
  private readonly proteinObject: IProteinObject;
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getMy(id: string): string {
    return this.configService.getProteinObject[id];
  }
}
