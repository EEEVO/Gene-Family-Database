import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  async register(@Body() body: any) {
    return await this.usersService.register(body);
  }

  @Post('insert')
  async insert() {
    return await this.usersService.insert();
  }
}
