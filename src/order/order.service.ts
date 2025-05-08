import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusOrder } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderDto,req: Request) {
    try {
      const order = await this.prisma.order.create({
        data: {
          restaurantId: data.restaurantId,
          table: data.table,
          waiterId: req['user-id'],
          status: 'PENDING',
          OrderItems: {
            create: data.orderItem.map(item => ({
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
            })),
          },
        },
        include: {
          OrderItems: {
            include: { product: true },
          },
        },
      });

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    status?: StatusOrder,
    restaurantId?: string,
    waiterId?: string,
    page = 1,
    limit = 10) {
    try {
      
      const orders = await this.prisma.order.findMany({
        where: {
          ...(status && { status: status }),
          ...(restaurantId && { restaurantId: restaurantId }),
          ...(waiterId && { waiterId: waiterId }),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          OrderItems: {
            include: { product: true },
          },
        },
      });

      return {orders};
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          OrderItems: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, data:UpdateOrderDto ) {
    try {
      const existing = await this.findOne(id);

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data,
        include: {
          OrderItems: {
            include: { product: true },
          },
        },
      });

      return updatedOrder;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.findOne(id);

      const deleted = await this.prisma.order.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
