import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;

  constructor(private readonly configService: ConfigService) {
    // Bot tokenini .env faylidan olish
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env file');
    }

    // Telegram botni ishga tushirish
    this.bot = new TelegramBot(token, { polling: false });
  }

  // Foydalanuvchiga xabar yuborish funksiyasi
  async sendMessageToUser(userId: string, message: string): Promise<boolean> {
    try {
      await this.bot.sendMessage(userId.toString(), message);
      return true;
    } catch (error) {
      console.error(`Xabar yuborishda xato: ${error.message}`);
      return false;
    }
  }
}