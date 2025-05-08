import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StatusOrder, UserRole } from '@prisma/client';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserRole.ADMIN,UserRole.WAITER,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() orderdata: CreateOrderDto, @Req() req:Request) {
    return this.orderService.create(orderdata,req);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.SUPERADMIN,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    example: 1,
    name: 'page',
    required:false
  })
  @ApiQuery({
    example: 10,
    name: 'limit',
    required: false
  })
  @ApiQuery({
    name: 'status',
    enum: StatusOrder,
    required:false
  })
  @ApiQuery({
    name: 'waiterId',
    required: false
  })
  @ApiQuery({
    name: 'restaurantId',
    required: true
  })
  findAll(
    @Query('status') status?: StatusOrder,
    @Query('restaurantId') restaurantId?: string,
    @Query('waiterId') waiterId?: string,
    @Query('page') page: number = 1,  
    @Query('limit') limit: number = 10,  
  ) {
    return this.orderService.findAll(status, restaurantId, waiterId,Number(page),Number(limit));
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.SUPERADMIN,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id,updateOrderDto);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER,UserRole.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
