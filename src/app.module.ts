import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './logical/user/users.module';
import { ConfigModule } from './common/config/config.module';
import { FileModule } from './logical/file/file.module';

@Module({
  imports: [UsersModule, ConfigModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
