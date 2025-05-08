import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TelegramService } from 'src/bot/bot.service';
import { TelegramModule } from 'src/bot/bot.module';

@Module({
  imports: [TelegramModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
