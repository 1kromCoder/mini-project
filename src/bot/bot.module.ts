import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramService } from './bot.service';

@Module({
  imports: [ConfigModule], // .env faylidagi sozlamalarni o'qish uchun
  providers: [TelegramService],
  exports: [TelegramService], // TelegramService'ni boshqa modullarda ishlatish uchun eksport qilamiz
})
export class TelegramModule {}