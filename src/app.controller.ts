import { Controller, Get, Query, Inject } from '@nestjs/common';
import { Result } from './common/intergaces/result.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get('gene')
  async getMy(@Query() params): Promise<Result> {
    return {
      code: 200,
      message: '查询成功',
      data: this.appService.getMy(params.id),
    };
  }
}
