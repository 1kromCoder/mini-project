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
import { request } from 'http';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}
  @Roles(UserRole.ADMIN, UserRole.CASHER, UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto, @Req() req: Request) {
    let cashedId = req['user-id'];
    return this.withdrawService.create(createWithdrawDto, cashedId);
  }
  @Get('stats')
  getStats(@Query('restaurantId') restaurantId?: string) {
    return this.withdrawService.getWithdrawStats(restaurantId);
  }
  @Get()
  findAll() {
    return this.withdrawService.findAll();
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
