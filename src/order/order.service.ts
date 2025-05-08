import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusOrder, UserRole } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';
import { triggerAsyncId } from 'async_hooks';
import { send } from 'process';
import { TelegramService } from 'src/bot/bot.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService,
    private readonly Telegram: TelegramService
  ) {}

  async create(data: CreateOrderDto, req: Request) {
    try {
      const userId = req['user-id'];
      console.log(userId)
      if (!userId) {
        throw new BadRequestException('Foydalanuvchi ID topilmadi');
      }
  
      const order = await this.prisma.order.create({
        data: {
          table: data.table,
          status: 'PENDING',
          restaurantId: data.restaurantId,
          waiterId: userId ,
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

      let restaurant = await this.prisma.restaurant.findFirst({where:{id:userId}})
      let message = `🧾 Yangi buyurtma:
📦 ID: ${order.id}
📍 Stol: ${order.table}
📋 Status: ${order.status}
🕒 Sana: ${order.createdAt.toLocaleString()}

🛒 Buyurtmalar:
${order.OrderItems.map((item, i) => 
  `${i + 1}) ${item.product.name} x${item.quantity}`
).join('\n')}
`;
      let user = await this.prisma.user.findFirst({where:{restaurantId:restaurant?.id,role:UserRole.OWNER}})
      if(user?.tgId && order){
        console.log("telegram")
        let result = await this.Telegram.sendMessageToUser(user.tgId,`${message}`)
        console.log(result)
      }
  
      return order;
    } catch (error) {
      console.error(error);
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
          user:true,
          restaurant:true,
          OrderItems: {
            include: { product: true},
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
