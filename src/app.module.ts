import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { DebtModule } from './debt/debt.module';
import { TelegramModule } from './bot/bot.module';

@Module({
  imports: [PrismaModule, RegionModule, RestaurantModule, CategoryModule, ProductModule,UserModule,AdminModule, OrderModule, WithdrawModule, DebtModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
