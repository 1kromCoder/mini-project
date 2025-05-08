import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Request } from 'express';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/user/decorators/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDebtDto: CreateDebtDto, @Req() req: Request) {
    return this.debtService.create(createDebtDto, req);
  }


  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.SUPERADMIN,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all debts with optional filtering, sorting, and pagination',
    description:
      'Fetch all debts with optional filters like restaurantId, orderId, client, casherId, sorting, and pagination.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page (default 10)',
  })
  @ApiQuery({
    name: 'restaurantId',
    required: true,
    type: String,
    description: 'Filter by restaurant ID',
  })
  @ApiQuery({
    name: 'orderId',
    required: false,
    type: String,
    description: 'Filter by order ID',
  })
  @ApiQuery({
    name: 'client',
    required: false,
    type: String,
    description: 'Filter by client name',
  })
  @ApiQuery({
    name: 'casherId',
    required: false,
    type: String,
    description: 'Filter by casher ID',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by specific field (default createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (asc or desc, default desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of debts with pagination info.',
    type: [CreateDebtDto],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('restaurantId') restaurantId?: string,
    @Query('orderId') orderId?: string,
    @Query('client') client?: string,
    @Query('casherId') casherId?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.debtService.findAll(
      page,
      pageSize,
      restaurantId,
      orderId,
      client,
      casherId,
      sortBy,
      sortOrder,
    );
  }


  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.SUPERADMIN ,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.CASHER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(id, updateDebtDto);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(id);
  }
}
