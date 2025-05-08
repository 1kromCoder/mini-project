import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('products')
  async topProducts(@Query('restaurantId') restaurantId: CreateStatDto) {
    return this.statsService.getTopProducts(restaurantId);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('waiters')
  async topWaiters(@Query('restaurantId') restaurantId: CreateStatDto) {
    return this.statsService.getTopWaiters(restaurantId);
  }
}