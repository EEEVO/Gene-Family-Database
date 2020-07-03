import { Injectable } from '@nestjs/common';
import { ConfigService } from './common/config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getMy(): string {
    // TODO:此处全局模块使用方式应该有问题
    console.log(this.configService.getProteinObject);
    return 'Hello My!';
  }
}
