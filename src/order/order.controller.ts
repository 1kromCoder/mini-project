import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { StatusOrder } from '@prisma/client';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() orderdata: CreateOrderDto, @Req() req:Request) {
    return this.orderService.create(orderdata,req);
  }

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
    required: false
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id,updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
