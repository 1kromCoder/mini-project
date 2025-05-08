import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}
  @Roles(UserRole.ADMIN, UserRole.CASHER, UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto, @Req() req: Request) {
    let cashedId = req['user-id'];
    console.log(cashedId)
    return this.withdrawService.create(createWithdrawDto, cashedId);
  }
  @Get('stats')
  getStats(@Query('restaurantId') restaurantId: string) {
    return this.withdrawService.getWithdrawStats(restaurantId);
  }
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.CASHER, UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'OUTCOME'] })
  @ApiQuery({ name: 'restaurantId', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('type') type?: 'INCOME' | 'OUTCOME',
    @Query('restaurantId') restaurantId?: string,
  ) {
    return this.withdrawService.findAll({
      page,
      limit,
      sortBy,
      sortOrder,
      type,
      restaurantId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(id);
  }
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.CASHER, UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawDto: UpdateWithdrawDto,
  ) {
    return this.withdrawService.update(id, updateWithdrawDto);
  }
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.CASHER, UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(id);
  }
}
